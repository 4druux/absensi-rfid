<?php

namespace App\Http\Controllers\Api;

use App\Events\AttendanceScanned;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Siswa;
use App\Models\Pertemuan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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

    public function getAttendanceByPertemuan(Pertemuan $pertemuan, Request $request)
    {
        $request->validate(['kelas_id' => 'required|exists:kelas,id']);
        $kelasId = $request->kelas_id;

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

        $combinedData = $allRelevantSiswa->map(function ($siswa) use ($attendanceRecords) {
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
                    'waktu_absen' => $waktu->translatedFormat('H:i:s')
                ];
            } else {
                return [
                    'siswa_id' => $siswa->id,
                    'nama' => $siswa->nama,
                    'rfid' => $siswa->rfid,
                    'jenis_kelamin' => $siswa->jenis_kelamin,
                    'status' => 'Alfa',
                    'tanggal_absen' => null,
                    'waktu_absen' => null
                ];
            }
        });

        return response()->json($combinedData);
    }
}