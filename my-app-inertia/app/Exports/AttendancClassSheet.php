<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class AttendancClassSheet implements FromCollection, WithHeadings, WithMapping, WithTitle
{
    protected $title;
    protected $pertemuanList;
    protected $siswaData;
    protected $headings;
    protected $mapIteration;

    public function __construct(string $title, Collection $pertemuanList, Collection $siswaData)
    {
        $this->title = $title;
        $this->pertemuanList = $pertemuanList;
        $this->siswaData = $siswaData;

        $this->headings = ['No', 'Nama Siswa', 'RFID'];
        foreach ($this->pertemuanList as $pertemuan) {
            $this->headings[] = $pertemuan->title;
        }
        $this->mapIteration = 0;
    }

    public function collection()
    {
        return $this->siswaData;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function headings(): array
    {
        return $this->headings;
    }

    public function map($row): array
    {
        $this->mapIteration++;

        $rowData = [
            $this->mapIteration,
            $row['nama'],
            $row['rfid'] ?? '-',
        ];

        foreach ($row['status'] as $status) {
            $rowData[] = $status;
        }

        return $rowData;
    }
}