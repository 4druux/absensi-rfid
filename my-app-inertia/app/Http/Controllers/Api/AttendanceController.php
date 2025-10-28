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
use App\Exports\AttendanceYearExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;

class AttendanceController extends Controller
{
    public function scan(Request $request)
    {
        $request->validate(['rfid' => 'required|string']);

        $activePertemuans = Pertemuan::where('is_active', true)->get();

        if ($activePertemuans->isEmpty()) {
            AttendanceScanned::dispatch('error', 'Absen Gagal!', 'Tidak ada sesi absensi yang aktif.');
            return response()->json(['message' => 'Tidak ada sesi absensi yang aktif.'], 404);
        }

        $siswa = Siswa::where('rfid', $request->rfid)
            ->with(['kelas', 'academicYear'])
            ->first();

        if (!$siswa) {
            AttendanceScanned::dispatch('error', 'Absen Gagal!', 'Kartu tidak terdaftar.');
            return response()->json(['message' => 'Kartu tidak terdaftar.'], 404);
        }

        if (!$siswa->academicYear || !$siswa->jenis_kelamin) {
             AttendanceScanned::dispatch('error', 'Absen Gagal!', 'Data siswa tidak lengkap (T.A/ JK).');
             return response()->json(['message' => 'Data siswa tidak lengkap.'], 400);
        }

        $matchingPertemuan = $activePertemuans->first(function ($pertemuan) use ($siswa) {
            return $pertemuan->tahun_ajaran == $siswa->academicYear->year
                   && $pertemuan->gender == $siswa->jenis_kelamin;
        });

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
            $message = "{$siswa->nama} - {$kelasInfo} sudah absen untuk pertemuan ini.";
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
            'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas . ' ' . $siswa->kelas->kelompok : 'N/A',
            'waktu' => Carbon::parse($attendance->waktu_absen)->format('H:i:s')
        ];

        AttendanceScanned::dispatch('success', 'Absen Berhasil!', "{$siswa->nama} - {$kelasInfo}");

        return response()->json([
            'message' => 'Absen Berhasil!',
            'record' => $record
        ], 201);
    }

    public function getTodaysAttendance()
    {
        $activePertemuanIds = Pertemuan::where('is_active', true)->pluck('id');

        if ($activePertemuanIds->isEmpty()) {
            return response()->json([]);
        }

        $attendances = Attendance::with(['siswa', 'siswa.kelas'])
            ->whereIn('pertemuan_id', $activePertemuanIds)
            ->orderBy('waktu_absen', 'asc')
            ->get();

        $records = $attendances->map(function ($att) {
            return [
                'id' => $att->id,
                'nama' => $att->siswa ? $att->siswa->nama : 'Siswa Dihapus',
                'kelas' => $att->siswa && $att->siswa->kelas ? $att->siswa->kelas->nama_kelas . ' ' . $att->siswa->kelas->kelompok : 'N/A',
                'waktu' => Carbon::parse($att->waktu_absen)->format('H:i:s')
            ];
        });

        return response()->json($records);
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
            ->get()
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
                    'status' => 'Hadir',
                    'tanggal_absen' => $waktu->translatedFormat('Y-m-d'),
                    'waktu_absen' => $waktu->translatedFormat('H:i:s'),
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
            'tanggal' => Carbon::parse($pertemuan->created_at)->translatedFormat('d F Y'),
            'hadirCount' => $data->where('status', 'Hadir')->count(),
            'alfaCount' => $data->where('status', 'Alfa')->count(),
        ];

        $pdf = PDF::loadView('exports.attendance-meet-pdf', $viewData);
        $fileName = "absensi_{$request->nama_kelas}_{$request->pertemuan_title}.pdf";

        return $pdf->download($fileName);
    }

    public function exportAtendanceByMeetExcel(Pertemuan $pertemuan, Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'nama_kelas' => 'required|string',
            'pertemuan_title' => 'required|string',
        ]);

        $data = $this->getAttendanceData($pertemuan, $request->kelas_id);

        $fileName = "absensi_{$request->nama_kelas}_{$request->pertemuan_title}.xlsx";
        return Excel::download(new AttendanceMeetExport($data), $fileName);
    }

    private function getClassAttendanceData($kelas_id, $tahun_ajaran)
    {
        $result = [];

        foreach (['L', 'P'] as $gender) {
            $pertemuanList = Pertemuan::where('tahun_ajaran', $tahun_ajaran)
                ->where('gender', $gender)
                ->orderBy('created_at', 'asc')
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
                ->get()
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
                        $statusList[] = 'Hadir';
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
        ]);

        $data = $this->getClassAttendanceData(
            $kelas->id,
            $request->tahun_ajaran
        );

        $reportInfo = [
            'nama_kelas' => $request->nama_kelas_lengkap,
            'nama_jurusan' => $request->nama_jurusan,
            'tahun_ajaran' => $request->tahun_ajaran,
        ];

        $pdf = PDF::loadView('exports.attendance-class-pdf', [
            'data' => $data,
            'reportInfo' => $reportInfo,
        ])->setPaper('a4', 'landscape');

        $fileName = "rekap_absensi_{$request->nama_kelas_lengkap}.pdf";
        return $pdf->download($fileName);
    }

    public function exportAtendanceByClassExcel(Request $request, Kelas $kelas)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'nama_kelas_lengkap' => 'required|string',
            'nama_jurusan' => 'required|string',
        ]);

        $data = $this->getClassAttendanceData(
            $kelas->id,
            $request->tahun_ajaran
        );

        $reportInfo = [
            'nama_kelas' => $request->nama_kelas_lengkap,
            'nama_jurusan' => $request->nama_jurusan,
            'tahun_ajaran' => $request->tahun_ajaran,
        ];

        $fileName = "rekap_absensi_{$request->nama_kelas_lengkap}.xlsx";

        return Excel::download(
            new AttendanceClassExport($data, $reportInfo),
            $fileName
        );
    }

    private function getYearAttendanceData($tahun_ajaran)
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
            $classData = $this->getClassAttendanceData($kelas->id, $tahun_ajaran);

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

        $yearData = $this->getYearAttendanceData($tahun_ajaran);

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
        ])->setPaper('a4', 'landscape');

        $fileName = "rekap_absensi_tahunan_{$tahun_ajaran}.pdf";
        return $pdf->download($fileName);
    }

    public function exportYearReportExcel(Request $request, $tahun_ajaran)
    {
         if (!preg_match('/^\d{4}-\d{4}$/', $tahun_ajaran)) {
             abort(400, 'Format tahun ajaran tidak valid.');
         }

        $yearData = $this->getYearAttendanceData($tahun_ajaran);

        if (empty($yearData)) {
             return response()->json(['error' => 'Tidak ada data absensi ditemukan untuk tahun ajaran ' . $tahun_ajaran], 404);
        }


        $fileName = "rekap_absensi_tahunan_{$tahun_ajaran}.xlsx";

        return Excel::download(
            new AttendanceYearExport($yearData, $tahun_ajaran),
            $fileName
        );
    }
}