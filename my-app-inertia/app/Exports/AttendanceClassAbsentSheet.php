<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class AttendanceClassAbsentSheet implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithTitle,
    ShouldAutoSize,
    WithStyles,
    WithCustomStartCell,
    WithEvents
{
    protected $title;
    protected $pertemuanList;
    protected $siswaData;
    protected $headings;
    protected $tahunAjaran;
    protected $mapIteration;
    protected $lastColumn;
    protected $totalRows;

    public function __construct(string $title, Collection $pertemuanList, Collection $siswaData, string $tahunAjaran)
    {
        $this->title = $title;
        $this->pertemuanList = $pertemuanList;
        $this->siswaData = $siswaData;
        $this->tahunAjaran = $tahunAjaran;

        $this->headings = ['No', 'Nama Siswa', 'RFID'];
        foreach ($this->pertemuanList as $pertemuan) {
            $this->headings[] = $pertemuan->title . "\n(" . $pertemuan->tanggal . ")";
        }

        $this->lastColumn = Coordinate::stringFromColumnIndex(count($this->headings));
        $this->totalRows = $this->siswaData->count() + 5;
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
            if ($status === 'Alfa') {
                $rowData[] = 'A';
            } elseif ($status === 'Bolos') {
                $rowData[] = 'B';
            } else {
                $rowData[] = '';
            }
        }

        return $rowData;
    }

    public function startCell(): string
    {
        return 'A5';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $sheet->mergeCells('A1:' . $this->lastColumn . '1');
                $sheet->setCellValue('A1', 'LAPORAN ABSENSI TIDAK HADIR');

                $sheet->mergeCells('A2:' . $this->lastColumn . '2');
                $sheet->setCellValue('A2', 'SMK YAPIA PARUNG');

                $sheet->mergeCells('A3:' . $this->lastColumn . '3');
                $sheet->setCellValue('A3', 'Tahun Ajaran: ' . $this->tahunAjaran);

                $headerStyle = [
                    'font' => ['bold' => true, 'size' => 12],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ];
                $sheet->getStyle('A1:A3')->applyFromArray($headerStyle);
            },
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $headerRow = 5;
        $headerRange = 'A' . $headerRow . ':' . $this->lastColumn . $headerRow;

        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => '000000']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'C4D79B']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
        ]);

        $tableRange = 'A' . $headerRow . ':' . $this->lastColumn . $this->totalRows;
        $sheet->getStyle($tableRange)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);
        
        $sheet->getStyle('A6:A' . $this->totalRows)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C6:C' . $this->totalRows)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $statusColumnStart = 'D';
        if (count($this->headings) > 3) {
             $sheet->getStyle($statusColumnStart . '6:' . $this->lastColumn . $this->totalRows)
                   ->getAlignment()
                   ->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }
    }
}