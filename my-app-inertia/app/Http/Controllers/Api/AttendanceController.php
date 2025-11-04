<?php

namespace App\Http\Controllers\Api;

use App\Events\AttendanceScanned;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Pertemuan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Exports\AttendanceMeetExport;
use App\Exports\AttendanceClassExport;
use App\Exports\AttendanceYearAbsentExport;
use App\Exports\AttendanceYearExport;
use App\Models\TitikAbsen;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function getDashboardData()
    {
        $activePertemuanIds = DB::table('pertemuan_titik_absen')->pluck('pertemuan_id')->unique();

        $isSessionActive = $activePertemuanIds->isNotEmpty();
        $records = collect([]);
        $status = [
            'type' => 'waiting',
            'title' => 'Menunggu Kartu...',
            'detail' => null,
        ];

        if ($isSessionActive) {
            $attendances = Attendance::whereIn('pertemuan_id', $activePertemuanIds)
                ->with(['siswa', 'siswa.kelas'])
                ->orderBy('waktu_absen', 'desc')
                ->get();

            $records = $attendances->map(function ($att) {
                return [
                    'id' => $att->id,
                    'nama' => $att->siswa ? $att->siswa->nama : 'Siswa Dihapus',
                    'kelas' => $att->siswa && $att->siswa->kelas ? $att->siswa->kelas->nama_kelas . ' ' . $att->siswa->kelas->kelompok : 'N/A',
                    'waktu' => Carbon::parse($att->waktu_absen)->format('H:i:s')
                ];
            });

            $lastRecord = $records->first();
            if ($lastRecord) {
                $status = [
                    'type' => 'success',
                    'title' => 'Absen Berhasil!',
                    'detail' => $lastRecord['nama'] . ' - ' . $lastRecord['kelas']
                ];
            }
        }

        return response()->json([
            'isSessionActive' => $isSessionActive,
            'attendanceCount' => $records->count(),
            'attendanceRecords' => $records,
            'status' => $status
        ]);
    }

    public function scan(Request $request)
    {
        $request->validate(['rfid' => 'required|string']);
        
        $apiKey = $request->bearerToken();
        if (!$apiKey) {
            return response()->json(['message' => 'API Key tidak ditemukan.'], 401);
        }

        $titikAbsen = TitikAbsen::where('api_key', $apiKey)->first();

        if (!$titikAbsen) {
            return response()->json(['message' => 'API Key tidak valid.'], 401);
        }

        $activePertemuans = $titikAbsen->pertemuanAktif;

        if ($activePertemuans->isEmpty()) {
            AttendanceScanned::dispatch('error', 'Absen Gagal!', 'Titik absen ini tidak memiliki sesi aktif.');
            return response()->json(['message' => 'Tidak ada sesi absensi yang aktif untuk titik ini.'], 404);
        }

        $siswa = Siswa::where('rfid', $request->rfid)
            ->with(['kelas', 'academicYear'])
            ->first();

        if (!$siswa) {
            AttendanceScanned::dispatch('error', 'Absen Gagal!', 'Kartu tidak terdaftar.');
            return response()->json(['message' => 'Kartu tidak terdaftar.'], 404);
        }

        if (!$siswa->academicYear || !$siswa->jenis_kelamin || !$siswa->kelas_id) {
             AttendanceScanned::dispatch('error', 'Absen Gagal!', 'Data siswa tidak lengkap (T.A/ JK/ Kelas).');
             return response()->json(['message' => 'Data siswa tidak lengkap.'], 400);
        }

        $matchingPertemuan = $activePertemuans
            ->where('tahun_ajaran', $siswa->academicYear->year)
            ->where('gender', $siswa->jenis_kelamin)
            ->where('kelas_id', $siswa->kelas_id)
            ->first();

        if (!$matchingPertemuan) {
            $kelasInfo = $siswa->kelas ? $siswa->kelas->nama_kelas . ' ' . $siswa->kelas->kelompok : 'Kelas Tidak Diketahui';
            $message = "{$siswa->nama} - {$kelasInfo} Tidak ada sesi absensi yang sesuai.";
            AttendanceScanned::dispatch('error', 'Absen Gagal!', $message);
            return response()->json(['message' => $message], 403);
        }

        $alreadyAttended = Attendance::where('siswa_id', $siswa->id)
            ->where('pertemuan_id', $matchingPertemuan->id)
            ->exists();

        if ($alreadyAttended) {
            $kelasInfo = $siswa->kelas ? $siswa->kelas->nama_kelas . ' ' . $siswa->kelas->kelompok : 'Kelas Tidak Diketahui';
            $message = "{$siswa->nama} - {$kelasInfo} sudah absen untuk sesi ini.";
            AttendanceScanned::dispatch('duplicate', 'Absen Gagal!', $message);
            return response()->json(['message' => $message], 409);
        }

        $attendance = Attendance::create([
            'siswa_id' => $siswa->id,
            'pertemuan_id' => $matchingPertemuan->id,
            'waktu_absen' => now()
        ]);

        $kelasInfo = $siswa->kelas ? $siswa->kelas->nama_kelas . ' ' . $siswa->kelas->kelompok : 'N/A';

        $record = [
            'id' => $attendance->id,
            'nama' => $siswa->nama,
            'kelas' => $kelasInfo,
            'waktu' => Carbon::parse($attendance->waktu_absen)->format('H:i:s')
        ];

        AttendanceScanned::dispatch('success', 'Absen Berhasil!', "{$siswa->nama} - {$kelasInfo}");

        return response()->json([
            'message' => 'Absen Berhasil!',
            'record' => $record
        ], 201);
    }

    private function getAttendanceData(Pertemuan $pertemuan, $kelasId)
    {
        $allRelevantSiswa = Siswa::where('kelas_id', $kelasId)
            ->whereHas('academicYear', function ($q) use ($pertemuan) {
                $q->where('year', $pertemuan->tahun_ajaran);
            })
            ->where('jenis_kelamin', $pertemuan->gender)
            ->orderBy('nama', 'asc')
            ->get(['id', 'nama', 'rfid', 'jenis_kelamin']);

        $attendanceRecords = Attendance::where('pertemuan_id', $pertemuan->id)
            ->whereIn('siswa_id', $allRelevantSiswa->pluck('id'))
            ->get(['siswa_id', 'waktu_absen', 'status'])
            ->keyBy('siswa_id');

        $combinedData = $allRelevantSiswa->map(function ($siswa) use (
            $attendanceRecords
        ) {
            $attendance = $attendanceRecords->get($siswa->id);

            if ($attendance) {
                $waktu = Carbon::parse($attendance->waktu_absen);
                return [
                    'siswa_id' => $siswa->id,
                    'nama' => $siswa->nama,
                    'rfid' => $siswa->rfid,
                    'jenis_kelamin' => $siswa->jenis_kelamin,
                    'status' => $attendance->status, 
                    'tanggal_absen' => $waktu->translatedFormat('d-m-Y'),
                    'waktu_absen' => $attendance->status !== 'Alfa' ? $waktu->translatedFormat('H:i:s') : null,
                ];
            } else {
                return [
                    'siswa_id' => $siswa->id,
                    'nama' => $siswa->nama,
                    'rfid' => $siswa->rfid,
                    'jenis_kelamin' => $siswa->jenis_kelamin,
                    'status' => 'Alfa',
                    'tanggal_absen' => null,
                    'waktu_absen' => null,
                ];
            }
        });

        return $combinedData;
    }

    public function getAttendanceByPertemuan(
        Pertemuan $pertemuan,
        Request $request
    ) {
        $request->validate(['kelas_id' => 'required|exists:kelas,id']);
        $kelasId = $request->kelas_id;

        $combinedData = $this->getAttendanceData($pertemuan, $kelasId);

        return response()->json($combinedData);
    }

    public function manualAttendance(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'pertemuan_id' => 'required|exists:pertemuans,id',
            'status' => 'required|string|in:Hadir,Telat,Sakit,Izin,Bolos,Alfa', 
        ]);

        $siswaId = $request->siswa_id;
        $pertemuanId = $request->pertemuan_id;
        $newStatus = $request->status;

        $attendance = Attendance::where('siswa_id', $siswaId)
            ->where('pertemuan_id', $pertemuanId)
            ->first();

        if ($newStatus === 'Alfa') {
            if ($attendance) {
                $attendance->delete();
                return response()->json(['status' => 'deleted', 'message' => 'Absensi dibatalkan, status menjadi Alfa.']);
            }
            return response()->json(['status' => 'ignored', 'message' => 'Status sudah Alfa.']);
        }
        

        $pertemuan = Pertemuan::find($pertemuanId);
        $siswa = Siswa::with('academicYear')->find($siswaId);

        if (
            !$siswa ||
            !$siswa->academicYear ||
            $siswa->academicYear->year != $pertemuan->tahun_ajaran ||
            $siswa->jenis_kelamin != $pertemuan->gender
        ) {
            return response()->json(['message' => 'Siswa tidak sesuai dengan kriteria pertemuan ini.'], 422);
        }

        $waktuAbsen = now();

        if ($attendance) {
            $attendance->update([
                'status' => $newStatus,
                'waktu_absen' => $waktuAbsen,
            ]);
            
            return response()->json([
                'status' => 'updated', 
                'message' => "Siswa ditandai {$newStatus}.",
                'record' => $attendance,
            ]);

        } else {
            $newAttendance = Attendance::create([
                'siswa_id' => $siswaId,
                'pertemuan_id' => $pertemuanId,
                'waktu_absen' => $waktuAbsen, 
                'status' => $newStatus,
            ]);

            return response()->json([
                'status' => 'created',
                'message' => "Siswa ditandai {$newStatus}.",
                'record' => $newAttendance,
            ], 201);
        }
    }

    public function exportAtendanceByMeetPdf(Pertemuan $pertemuan, Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'nama_kelas' => 'required|string',
            'nama_jurusan' => 'required|string',
            'pertemuan_title' => 'required|string',
        ]);

        $data = $this->getAttendanceData($pertemuan, $request->kelas_id);

        $viewData = [
            'records' => $data,
            'pertemuanTitle' => $request->pertemuan_title,
            'nama_kelas' => $request->nama_kelas,
            'nama_jurusan' => $request->nama_jurusan,
            'tanggal' => Carbon::parse($pertemuan->tanggal_pertemuan ?? $pertemuan->created_at)->translatedFormat('d F Y'),
            'hadirCount' => $data->where('status', 'Hadir')->count(),
            'telatCount' => $data->where('status', 'Telat')->count(),
            'sakitCount' => $data->where('status', 'Sakit')->count(),
            'izinCount' => $data->where('status', 'Izin')->count(),
            'bolosCount' => $data->where('status', 'Bolos')->count(),
            'alfaCount' => $data->where('status', 'Alfa')->count(),
        ];

        $viewData['logoPath'] = 'images/logo-smk.png';

        $pdf = PDF::loadView('exports.attendance-meet-pdf', $viewData);
        $fileName = "absensi-{$request->nama_kelas}-{$request->pertemuan_title}.pdf";

        return $pdf->download($fileName);
    }

    public function exportAtendanceByMeetExcel(Pertemuan $pertemuan, Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'nama_kelas' => 'required|string',
            'nama_jurusan' => 'required|string',
            'pertemuan_title' => 'required|string',
        ]);

        $data = $this->getAttendanceData($pertemuan, $request->kelas_id);

        $fileName = "absensi-{$request->nama_kelas}-{$request->pertemuan_title}.xlsx";
        $reportInfo = [
            'namaKelas' => $request->nama_kelas,
            'namaJurusan' => $request->nama_jurusan,
            'pertemuanTitle' => $pertemuan->title,
            'tanggal' => Carbon::parse($pertemuan->tanggal_pertemuan ?? $pertemuan->created_at)->translatedFormat('d F Y')
        ];

        return Excel::download(new AttendanceMeetExport($data, $reportInfo), $fileName);
    }

    private function getClassAttendanceData($kelas_id, $tahun_ajaran, $pertemuan_ids = [])
    {
        $result = [];

        foreach (['L', 'P'] as $gender) {

            $pertemuanQuery = Pertemuan::where('tahun_ajaran', $tahun_ajaran)
            ->where('gender', $gender);

            if (!empty($pertemuan_ids)) {
                $pertemuanQuery->whereIn('id', $pertemuan_ids);
            }

            $pertemuanQuery->where('kelas_id', $kelas_id);

           $pertemuanList = $pertemuanQuery->orderBy('created_at', 'asc')
            ->select(
                'id',
                'tahun_ajaran',
                'gender',
                'title',
                DB::raw("DATE_FORMAT(COALESCE(tanggal_pertemuan, created_at), '%d/%m/%Y') as tanggal")
            )
            ->get();

            if ($pertemuanList->isEmpty()) {
                $result[$gender] = [
                    'pertemuan_list' => collect([]),
                    'siswa_data' => collect([]),
                ];
                continue;
            }

            $siswaList = Siswa::where('kelas_id', $kelas_id)
                ->whereHas('academicYear', function ($q) use ($tahun_ajaran) {
                    $q->where('year', $tahun_ajaran);
                })
                ->where('jenis_kelamin', $gender)
                ->orderBy('nama', 'asc')
                ->get();

            if ($siswaList->isEmpty()) {
                $result[$gender] = [
                    'pertemuan_list' => $pertemuanList,
                    'siswa_data' => collect([]),
                ];
                continue;
            }

            $pertemuanIds = $pertemuanList->pluck('id');
            $siswaIds = $siswaList->pluck('id');

            $attendanceRecords = Attendance::whereIn('pertemuan_id', $pertemuanIds)
                ->whereIn('siswa_id', $siswaIds)
                ->get(['siswa_id', 'pertemuan_id', 'status'])
                ->keyBy(function ($item) {
                    return $item->siswa_id . '-' . $item->pertemuan_id;
                });

            $siswaData = $siswaList->map(function ($siswa) use (
                $pertemuanList,
                $attendanceRecords
            ) {
                $statusList = [];
                foreach ($pertemuanList as $pertemuan) {
                    $key = $siswa->id . '-' . $pertemuan->id;
                    $record = $attendanceRecords->get($key);

                    if ($record) {
                        $statusList[] = $record->status;
                    } else {
                        $statusList[] = 'Alfa';
                    }
                }

                return [
                    'siswa_id' => $siswa->id,
                    'nama' => $siswa->nama,
                    'rfid' => $siswa->rfid,
                    'status' => $statusList,
                ];
            });

            $result[$gender] = [
                'pertemuan_list' => $pertemuanList,
                'siswa_data' => $siswaData,
            ];
        }
        return $result;
    }

    public function exportAtendanceByClassPdf(Request $request, Kelas $kelas)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'nama_kelas_lengkap' => 'required|string',
            'nama_jurusan' => 'required|string',
            'pertemuan_ids' => 'sometimes|array',
        ]);

        $pertemuan_ids = $request->input('pertemuan_ids', []);

        $data = $this->getClassAttendanceData(
            $kelas->id,
            $request->tahun_ajaran,
            $pertemuan_ids 
        );

        $reportInfo = [
            'nama_kelas' => $request->nama_kelas_lengkap,
            'nama_jurusan' => $request->nama_jurusan,
            'tahun_ajaran' => $request->tahun_ajaran,
        ];

        $pdf = PDF::loadView('exports.attendance-class-pdf', [
            'data' => $data,
            'reportInfo' => $reportInfo,
            'logoPath' => 'images/logo-smk.png',
        ])->setPaper('a4', 'landscape');

        $fileName = "absensi-{$request->nama_kelas_lengkap}-{$request->tahun_ajaran}.pdf";
        return $pdf->download($fileName);
    }

    public function exportAtendanceByClassExcel(Request $request, Kelas $kelas)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'nama_kelas_lengkap' => 'required|string',
            'nama_jurusan' => 'required|string',
            'pertemuan_ids' => 'sometimes|array',
        ]);

        $pertemuan_ids = $request->input('pertemuan_ids', []);

        $data = $this->getClassAttendanceData(
            $kelas->id,
            $request->tahun_ajaran,
            $pertemuan_ids
        );

        $reportInfo = [
            'nama_kelas' => $request->nama_kelas_lengkap,
            'nama_jurusan' => $request->nama_jurusan,
            'tahun_ajaran' => $request->tahun_ajaran,
        ];

        $fileName = "absensi-{$request->nama_kelas_lengkap}-{$request->tahun_ajaran}.xlsx";

        return Excel::download(
            new AttendanceClassExport($data, $reportInfo),
            $fileName
        );
    }

    private function getYearAttendanceData($tahun_ajaran, $pertemuan_ids = [])
    {
        $classes = Kelas::whereHas('siswas', function (Builder $query) use ($tahun_ajaran) {
                        $query->whereHas('academicYear', function (Builder $q) use ($tahun_ajaran) {
                            $q->where('year', $tahun_ajaran);
                        });
                    })
            ->orderBy('nama_kelas') 
            ->orderBy('kelompok')
            ->get();

        if ($classes->isEmpty()) {
            return []; 
        }

        $yearData = [];

        foreach ($classes as $kelas) {
            $classData = $this->getClassAttendanceData($kelas->id, $tahun_ajaran, $pertemuan_ids);

            if (
                (!empty($classData['L']['siswa_data']) && !$classData['L']['siswa_data']->isEmpty()) ||
                (!empty($classData['P']['siswa_data']) && !$classData['P']['siswa_data']->isEmpty())
            ) {
                 $yearData[$kelas->id] = $classData;
            }
        }

        return $yearData; 
    }

    public function exportYearReportPdf(Request $request, $tahun_ajaran)
    {
        if (!preg_match('/^\d{4}-\d{4}$/', $tahun_ajaran)) {
             abort(400, 'Format tahun ajaran tidak valid.');
        }

        $pertemuan_ids = $request->input('pertemuan_ids', []);

        $yearData = $this->getYearAttendanceData($tahun_ajaran, $pertemuan_ids);

        $kelasInfoList = collect([]);
        if (!empty($yearData)) {
            $kelasInfoList = Kelas::with('jurusan')
                ->whereIn('id', array_keys($yearData))
                ->get()
                ->keyBy('id');
        }


        $pdf = PDF::loadView('exports.attendance-year-pdf', [
            'yearData' => $yearData,
            'tahunAjaran' => $tahun_ajaran,
            'kelasInfoList' => $kelasInfoList, 
            'logoPath' => 'images/logo-smk.png',
        ])->setPaper('a4', 'landscape');

        $fileName = "absensi-TA-{$tahun_ajaran}.pdf";
        return $pdf->download($fileName);
    }

    public function exportYearReportExcel(Request $request, $tahun_ajaran)
    {
         if (!preg_match('/^\d{4}-\d{4}$/', $tahun_ajaran)) {
             abort(400, 'Format tahun ajaran tidak valid.');
         }

        $pertemuan_ids = $request->input('pertemuan_ids', []);
        $yearData = $this->getYearAttendanceData($tahun_ajaran, $pertemuan_ids);

        if (empty($yearData)) {
             return response()->json(['error' => 'Tidak ada data absensi ditemukan untuk tahun ajaran ' . $tahun_ajaran], 404);
        }


        $fileName = "absensi-TA-{$tahun_ajaran}.xlsx";

        return Excel::download(
            new AttendanceYearExport($yearData, $tahun_ajaran),
            $fileName
        );
    }

    public function exportYearReportAbsentPdf(Request $request, $tahun_ajaran)
    {
        if (!preg_match('/^\d{4}-\d{4}$/', $tahun_ajaran)) {
            abort(400, 'Format tahun ajaran tidak valid.');
        }

        $pertemuan_ids = $request->input('pertemuan_ids', []);

        $yearData = $this->getYearAttendanceData($tahun_ajaran, $pertemuan_ids);
        $kelasInfoList = collect([]);

        $absentYearData = [];
        foreach ($yearData as $kelasId => $classData) {
            $absentClassData = [];
            foreach ($classData as $gender => $genderData) {
                $absentSiswaData = collect($genderData['siswa_data'])->filter(function ($siswa) {
                    return in_array('Alfa', $siswa['status']) || in_array('Bolos', $siswa['status']); 
                });

                $absentClassData[$gender] = [
                    'pertemuan_list' => $genderData['pertemuan_list'],
                    'siswa_data' => $absentSiswaData,
                ];
            }
            
            if (!empty($absentClassData)) {
                $absentYearData[$kelasId] = $absentClassData;
            }
        }

        if (!empty($absentYearData)) {
            $kelasInfoList = Kelas::with('jurusan')
                ->whereIn('id', array_keys($absentYearData))
                ->get()
                ->keyBy('id');
        }

        $pdf = PDF::loadView('exports.attendance-year-absent-pdf', [
            'yearData' => $absentYearData,
            'tahunAjaran' => $tahun_ajaran,
            'kelasInfoList' => $kelasInfoList,
            'logoPath' => 'images/logo-smk.png',
        ])->setPaper('a4', 'landscape');

        $fileName = "absensi-TIDAK-HADIR-TA-{$tahun_ajaran}.pdf";
        return $pdf->download($fileName);
    }

    public function exportYearReportAbsentExcel(Request $request, $tahun_ajaran)
    {
        if (!preg_match('/^\d{4}-\d{4}$/', $tahun_ajaran)) {
            abort(400, 'Format tahun ajaran tidak valid.');
        }

        $pertemuan_ids = $request->input('pertemuan_ids', []);
        $yearData = $this->getYearAttendanceData($tahun_ajaran, $pertemuan_ids);

        $absentYearData = [];
        foreach ($yearData as $kelasId => $classData) {
            $absentClassData = [];
            foreach ($classData as $gender => $genderData) {
                
                $absentSiswaData = collect($genderData['siswa_data'])->filter(function ($siswa) {
                    return in_array('Alfa', $siswa['status']) || in_array('Bolos', $siswa['status']); 
                });

                $absentClassData[$gender] = [
                    'pertemuan_list' => $genderData['pertemuan_list'],
                    'siswa_data' => $absentSiswaData,
                ];
            }

            if (!empty($absentClassData)) {
                $absentYearData[$kelasId] = $absentClassData;
            }
        }

        if (empty($absentYearData)) {
            return response()->json(['error' => 'Tidak ada data siswa yang tidak hadir untuk tahun ajaran ' . $tahun_ajaran], 404);
        }

        $fileName = "absensi-TIDAK-HADIR-TA-{$tahun_ajaran}.xlsx";

        return Excel::download(
            new AttendanceYearAbsentExport($absentYearData, $tahun_ajaran),
            $fileName
        );
    }
}