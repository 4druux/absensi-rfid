<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\TitikAbsen;
use App\Models\Pertemuan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TitikAbsenController extends Controller
{
    public function index()
    {
        $titikAbsens = TitikAbsen::with('pertemuanAktif.kelas') 
            ->orderByRaw('LENGTH(nama_titik), nama_titik') 
            ->get();
            
        return response()->json($titikAbsens);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_titik' => 'required|string|max:255',
      ]);

        $identifier = Str::slug($request->input('nama_titik'));

        $validator = Validator::make(
            ['identifier' => $identifier],
            [
            'identifier' => 'required|string|max:255|unique:titik_absens,identifier'],
            [
                'identifier.unique' => 'Nama titik ini sudah ada.'
                ]
        );

    if ($validator->fails()) {
        throw new ValidationException($validator);
    }

        $titikAbsen = TitikAbsen::create([
            'nama_titik' => $request->input('nama_titik'),
            'identifier' => $identifier,
        ]);

        return response()->json($titikAbsen, 201);
    }

    public function destroy(TitikAbsen $titikAbsen)
    {
        $titikAbsen->delete();
        return response()->json(['message' => 'Titik absen berhasil dihapus.']);
    }

    public function getAvailablePertemuan()
    {
        $pertemuan = Pertemuan::whereDoesntHave('titikAbsen')
            ->with('kelas.jurusan')
            ->orderBy('tanggal_pertemuan', 'asc')
            ->orderBy('title', 'asc')
            ->get();
            
        $formattedPertemuan = $pertemuan->map(function ($p) {
            if ($p->tanggal_pertemuan) {
                $p->tanggal_pertemuan_formatted = Carbon::parse($p->tanggal_pertemuan)->format('d/m/Y');
            } else {
                $p->tanggal_pertemuan_formatted = 'Tgl tidak diatur';
            }
            
            $namaKelasLengkap = '';
            if ($p->kelas) {
                $namaKelasLengkap = $p->kelas->nama_kelas;
                if ($p->kelas->kelompok) {
                    $namaKelasLengkap .= ' ' . $p->kelas->kelompok;
                }
                if ($p->kelas->jurusan) {
                    $namaKelasLengkap .= ' - ' . $p->kelas->jurusan->nama_jurusan;
                }
            }
            $p->nama_kelas_lengkap = $namaKelasLengkap;

            return $p;
        });
        return response()->json($formattedPertemuan);
    }
    

    public function assignPertemuan(Request $request, TitikAbsen $titikAbsen)
    {
        $request->validate([
           'pertemuan_id' => 'required|array',
            'pertemuan_id.*' => [
                'integer',
                Rule::exists('pertemuans', 'id'),
                Rule::unique('pertemuan_titik_absen', 'pertemuan_id') 
                    ->where(function ($query) use ($titikAbsen) {
                        return $query->where('titik_absen_id', $titikAbsen->id);
                    }),
            ],
        ], [
            'pertemuan_id.*.unique' => 'Salah satu sesi sudah terhubung ke titik absen tersebut.'
        ]);

        $titikAbsen->pertemuanAktif()->attach($request->pertemuan_id);

        return response()->json($titikAbsen->load('pertemuanAktif'));
    }

    public function unassignPertemuan(TitikAbsen $titikAbsen, Pertemuan $pertemuan)
    {
        $titikAbsen->pertemuanAktif()->detach($pertemuan->id);
        return response()->json($titikAbsen);
    }

    public function getMonitorData($identifier)
    {
        $titikAbsen = TitikAbsen::where('identifier', $identifier)
            ->with('pertemuanAktif')
            ->first();

        if (!$titikAbsen) {
            return response()->json(['message' => 'Titik absen tidak ditemukan.'], 404);
        }

        $activePertemuans = $titikAbsen->pertemuanAktif;

        if ($activePertemuans->isEmpty()) {
            return response()->json([
                'isSessionActive' => false,
                'attendanceCount' => 0,
                'attendanceRecords' => [],
                'status' => [
                    'type' => 'waiting',
                    'title' => 'Sesi Tidak Aktif',
                    'detail' => 'Tidak ada sesi yang terhubung ke titik absen ini.'
                ]
            ]);
        }

        $activePertemuanIds = $activePertemuans->pluck('id');

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
        $sessionTitles = $activePertemuans->pluck('title')->implode(', ');

        return response()->json([
            'isSessionActive' => true,
            'attendanceCount' => $records->count(),
            'attendanceRecords' => $records,
            'status' => $lastRecord ? [
                'type' => 'success',
                'title' => 'Absen Berhasil!',
                'detail' => $lastRecord['nama'] . ' - ' . $lastRecord['kelas']
            ] : [
                'type' => 'waiting',
                'title' => 'Menunggu Absen',
                'detail' => "Sesi '{$sessionTitles}' sedang aktif."
            ]
        ]);
    }
}