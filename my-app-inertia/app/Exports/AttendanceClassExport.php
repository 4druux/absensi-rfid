<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Exports\AttendanceClassSheet;

class AttendanceClassExport implements WithMultipleSheets
{
    protected $data;
    protected $reportInfo;

    public function __construct(array $data, array $reportInfo)
    {
        $this->data = $data;
        $this->reportInfo = $reportInfo;
    }

    public function sheets(): array
    {
        $sheets = [];
        
        $tahunAjaran = $this->reportInfo['tahun_ajaran'] ?? '';

        if (isset($this->data['L']) && !$this->data['L']['siswa_data']->isEmpty()) {
            $sheets[] = new AttendanceClassSheet(
                'Laki-laki',
                $this->data['L']['pertemuan_list'],
                $this->data['L']['siswa_data'],
                $tahunAjaran
            );
        }

        if (isset($this->data['P']) && !$this->data['P']['siswa_data']->isEmpty()) {
            $sheets[] = new AttendanceClassSheet(
                'Perempuan',
                $this->data['P']['pertemuan_list'],
                $this->data['P']['siswa_data'],
                $tahunAjaran
            );
        }

        return $sheets;
    }
}