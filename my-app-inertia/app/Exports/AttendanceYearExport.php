<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Models\Kelas; // Import model Kelas

class AttendanceYearExport implements WithMultipleSheets
{
    protected $yearData;
    protected $tahunAjaran;

    /**
     * @param array $yearData Data absensi yang dikelompokkan per kelas_id
     * @param string $tahunAjaran Tahun ajaran yang diekspor
     */
    public function __construct(array $yearData, string $tahunAjaran)
    {
        $this->yearData = $yearData;
        $this->tahunAjaran = $tahunAjaran;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];
        $classIds = array_keys($this->yearData);

        // Ambil informasi kelas sekaligus untuk efisiensi
        $kelasInfo = Kelas::with('jurusan')
                        ->whereIn('id', $classIds)
                        ->get()
                        ->keyBy('id');

        foreach ($this->yearData as $kelasId => $classData) {
            $kelas = $kelasInfo->get($kelasId);
            if (!$kelas) continue; // Skip jika info kelas tidak ditemukan

            $namaKelasLengkap = $kelas->nama_kelas . ' ' . $kelas->kelompok;
            $namaJurusan = $kelas->jurusan ? $kelas->jurusan->nama_jurusan : 'N/A';
            $sheetTitle = $namaKelasLengkap; // Judul sheet = Nama Kelas

             // Buat Sheet untuk Laki-laki jika ada datanya
            if (!empty($classData['L']['siswa_data']) && !$classData['L']['siswa_data']->isEmpty()) {
                $sheets[] = new AttendancClassSheet(
                    $sheetTitle . ' (L)', // Tambahkan gender ke judul sheet
                    $classData['L']['pertemuan_list'],
                    $classData['L']['siswa_data']
                );
            }

            // Buat Sheet untuk Perempuan jika ada datanya
            if (!empty($classData['P']['siswa_data']) && !$classData['P']['siswa_data']->isEmpty()) {
                 $sheets[] = new AttendancClassSheet(
                    $sheetTitle . ' (P)', // Tambahkan gender ke judul sheet
                    $classData['P']['pertemuan_list'],
                    $classData['P']['siswa_data']
                 );
            }
        }

        // Urutkan sheets berdasarkan nama (opsional, agar lebih rapi)
        // usort($sheets, function ($a, $b) {
        //     return strcmp($a->title(), $b->title());
        // });


        return $sheets;
    }
}