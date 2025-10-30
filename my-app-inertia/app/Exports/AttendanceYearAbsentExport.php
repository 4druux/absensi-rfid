<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Models\Kelas;
use App\Exports\AttendanceClassAbsentSheet;

class AttendanceYearAbsentExport implements WithMultipleSheets
{
    protected $yearData;
    protected $tahunAjaran;

    public function __construct(array $yearData, string $tahunAjaran)
    {
        $this->yearData = $yearData;
        $this->tahunAjaran = $tahunAjaran;
    }

    public function sheets(): array
    {
        $sheets = [];
        $classIds = array_keys($this->yearData);

        $kelasInfo = Kelas::with('jurusan')
                            ->whereIn('id', $classIds)
                            ->get()
                            ->keyBy('id');

        foreach ($this->yearData as $kelasId => $classData) {
            $kelas = $kelasInfo->get($kelasId);
            if (!$kelas) continue;

            $namaKelasLengkap = $kelas->nama_kelas . ' ' . $kelas->kelompok;
            $sheetTitle = $namaKelasLengkap;

            if (!empty($classData['L']['siswa_data']) && !$classData['L']['siswa_data']->isEmpty()) {
                $sheets[] = new AttendanceClassAbsentSheet(
                    $sheetTitle . ' (L)',
                    $classData['L']['pertemuan_list'],
                    $classData['L']['siswa_data'],
                    $this->tahunAjaran
                );
            }

            if (!empty($classData['P']['siswa_data']) && !$classData['P']['siswa_data']->isEmpty()) {
                 $sheets[] = new AttendanceClassAbsentSheet(
                    $sheetTitle . ' (P)',
                    $classData['P']['pertemuan_list'],
                    $classData['P']['siswa_data'],
                    $this->tahunAjaran
                 );
            }
        }
        return $sheets;
    }
}