<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

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

        if (isset($this->data['L'])) {
            $sheets[] = new AttendancClassSheet(
                'Laki-laki',
                $this->data['L']['pertemuan_list'],
                $this->data['L']['siswa_data']
            );
        }

        if (isset($this->data['P'])) {
            $sheets[] = new AttendancClassSheet(
                'Perempuan',
                $this->data['P']['pertemuan_list'],
                $this->data['P']['siswa_data']
            );
        }

        return $sheets;
    }
}