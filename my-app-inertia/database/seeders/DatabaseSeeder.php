<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AcademicYear;
use App\Models\Jurusan;
use App\Models\Kelas;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Andrew S',
            'email' => 'admin123@gmail.com',
            'password' => '12345678',
            'role' => 'superadmin'
        ]);

        DB::table('academic_years')->delete();

        for ($startYear = 2022; $startYear <= 2026; $startYear++) {
            $endYear = $startYear + 1;
            AcademicYear::create([
                'year' => $startYear . '-' . $endYear
            ]);
        }


        $jurusanJarkom = Jurusan::create([
            'nama_jurusan' => 'JARKOM'
        ]);

        Kelas::create([
            'jurusan_id' => $jurusanJarkom->id,
            'nama_kelas' => 'X',
            'kelompok' => 'TKJ 1'
        ]);
        Kelas::create([
            'jurusan_id' => $jurusanJarkom->id,
            'nama_kelas' => 'XI',
            'kelompok' => 'TKJ 1'
        ]);
        Kelas::create([
            'jurusan_id' => $jurusanJarkom->id,
            'nama_kelas' => 'X',
            'kelompok' => 'TKJ 2'
        ]);
        Kelas::create([
            'jurusan_id' => $jurusanJarkom->id,
            'nama_kelas' => 'XI',
            'kelompok' => 'TKJ 2'
        ]);
    }
}
