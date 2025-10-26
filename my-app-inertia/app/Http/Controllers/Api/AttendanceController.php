<?php

namespace App\Http\Controllers\Api;

use App\Events\AttendanceScanned;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AttendanceController extends Controller
{
    public function scan(Request $request)
    {
        $request->validate([
            'rfid' => 'required|string',
        ]);

        $siswa = Siswa::where('rfid', $request->rfid)->with('kelas')->first();

        if (!$siswa) {
            AttendanceScanned::dispatch('error', 'Absen Gagal!', 'Kartu tidak terdaftar.');
            
            return response()->json(['message' => 'Kartu tidak terdaftar.'], 404);
        }

        $today = Carbon::today();
        $alreadyAttended = Attendance::where('siswa_id', $siswa->id)
            ->whereDate('waktu_absen', $today)
            ->exists();

        if ($alreadyAttended) {
            $message = "{$siswa->nama} sudah tercatat absen hari ini.";
            
            AttendanceScanned::dispatch('duplicate', 'Absen Gagal!', $message);
            
            return response()->json(['message' => $message], 409);
        }

        $attendance = Attendance::create([
            'siswa_id' => $siswa->id,
            'waktu_absen' => now()
        ]);

        $record = [
            'id' => $attendance->id,
            'nama' => $siswa->nama,
            'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas . ' ' . $siswa->kelas->kelompok : 'N/A',
            'waktu' => Carbon::parse($attendance->waktu_absen)->format('H:i:s')
        ];

        AttendanceScanned::dispatch('success', 'Absen Berhasil!', $siswa->nama);

        return response()->json([
            'message' => 'Absen Berhasil!',
            'record' => $record
        ], 201);
    }

    public function getTodaysAttendance()
    {
        $today = Carbon::today();

        $attendances = Attendance::with(['siswa', 'siswa.kelas'])
            ->whereDate('waktu_absen', $today)
            ->orderBy('waktu_absen', 'asc')
            ->get();

        $records = $attendances->map(function ($att) {
            return [
                'id' => $att->id,
                'nama' => $att->siswa ? $att->siswa->nama : 'Siswa Dihapus',
                'kelas' => $att->siswa && $att->siswa->kelas ? $att->siswa->kelas->nama_kelas . ' ' . $att->siswa->kelas->kelompok : 'N/A', // Sesuaikan ini
                'waktu' => Carbon::parse($att->waktu_absen)->format('H:i:s')
            ];
        });

        return response()->json($records);
    }
}