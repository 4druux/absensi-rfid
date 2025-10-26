<?php

namespace App\Http\Controllers\Api\DataSiswa;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KelasController extends Controller
{
    public function getKelasByJurusan(Jurusan $jurusan)
    {
        return response()->json($jurusan->kelas()->orderBy('nama_kelas')->orderBy('kelompok')->get());
    }

    public function getKelas()
    {
        $summary = DB::table('siswas')
            ->join('kelas', 'siswas.kelas_id', '=', 'kelas.id')
            ->join('jurusans', 'kelas.jurusan_id', '=', 'jurusans.id')
            ->join('academic_years', 'siswas.academic_year_id', '=', 'academic_years.id')
            ->select(
                'kelas.id as kelas_id',
                'kelas.nama_kelas',
                'kelas.kelompok',
                'jurusans.nama_jurusan',
                'academic_years.year as tahun_ajaran',
            )
            ->groupBy('kelas.id', 'kelas.nama_kelas', 'kelas.kelompok', 'jurusans.nama_jurusan', 'academic_years.year')
            ->orderBy('academic_years.year', 'desc')
            ->orderBy('kelas.nama_kelas', 'asc')
            ->orderBy('kelas.kelompok', 'asc')
            ->get();

        return response()->json($summary);
    }

    public function showKelas(Request $request, Kelas $kelas)
    {
        $validated = $request->validate([
            'tahun_ajaran' => 'required|string|exists:academic_years,year',
        ]);

        $academicYear = AcademicYear::where('year', $validated['tahun_ajaran'])->firstOrFail();

        $kelas->load(['jurusan', 'siswas' => function ($query) use ($academicYear) {
            $query->where('academic_year_id', $academicYear->id)->orderBy('nama', 'asc');
        }]);

        return response()->json($kelas);
    }


    public function createKelas(Request $request)
    {
        $validated = $request->validate([
            'jurusan_id' => 'required|exists:jurusans,id',
            'nama_kelas' => 'required|string|max:255',
            'kelompok' => 'required|string|max:255',
        ]);

        $kelas = Kelas::create($validated);

        return response()->json(['message' => 'Kelas berhasil ditambahkan.', 'kelas' => $kelas], 201);
    }

    public function deleteKelas(Kelas $kelas)
    {
        DB::transaction(function () use ($kelas) {
            $userIds = $kelas->siswas()->pluck('user_id')->filter();

            if ($userIds->isNotEmpty()) {
                User::whereIn('id', $userIds)->delete();
            }

            $kelas->delete();
        });
        return response()->json(['message' => 'Kelas berhasil dihapus.']);
    }
}
