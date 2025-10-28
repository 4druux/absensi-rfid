<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AttendanceMeetExport implements FromCollection, WithHeadings, WithMapping
{
    protected $data;

    public function __construct(Collection $data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Siswa',
            'Jenis Kelamin',
            'RFID',
            'Status',
            'Tanggal Absen',
            'Waktu Absen',
        ];
    }

    public function map($row): array
    {
        static $i = 0;
        $i++;

        $jenisKelamin = '-';
        if (isset($row['jenis_kelamin'])) {
            $jenisKelamin = $row['jenis_kelamin'] === 'L' ? 'Laki-laki' : 'Perempuan';
        }

        return [
            $i,
            $row['nama'],
            $jenisKelamin, 
            $row['rfid'] ?? '-',
            $row['status'],
            $row['tanggal_absen'] ?? '-',
            $row['waktu_absen'] ?? '-',
        ];
    }
}