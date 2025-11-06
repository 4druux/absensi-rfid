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

class AttendanceSessionAbsentExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithTitle,
    ShouldAutoSize,
    WithStyles,
    WithCustomStartCell,
    WithEvents
{
    protected $data;
    protected $reportInfo;
    protected $headings;
    protected $mapIteration;
    protected $lastColumn;
    protected $totalRows;

    public function __construct(Collection $data, array $reportInfo)
    {
        $this->data = $data;
        $this->reportInfo = $reportInfo;
        $this->mapIteration = 0;

        $this->headings = [
            'No',
            'Nama Siswa',
            'Jenis Kelamin',
            'Kelas',
            'RFID',
            'Status',
        ];

        $this->lastColumn = Coordinate::stringFromColumnIndex(count($this->headings));
        $this->totalRows = $this->data->count() + 4;
    }

    public function collection()
    {
        return $this->data;
    }

    public function title(): string
    {
        return 'Siswa Tidak Hadir';
    }

    public function headings(): array
    {
        return $this->headings;
    }

    public function map($row): array
    {
        $this->mapIteration++;

        $jenisKelamin = '-';
        if (isset($row['jenis_kelamin'])) {
            $jenisKelamin = $row['jenis_kelamin'] === 'L' ? 'Laki-laki' : 'Perempuan';
        }

        $statusDisplay = 'A';
        switch ($row['status']) {
            case 'Bolos':
                $statusDisplay = 'B';
                break;
            case 'Alfa':
            default:
                $statusDisplay = 'A';
                break;
        }

        return [
            $this->mapIteration,
            $row['nama'],
            $jenisKelamin,
            $row['kelas'],
            $row['rfid'] ?? '-',
            $statusDisplay,
        ];
    }

    public function startCell(): string
    {
        return 'A4';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $sheet->mergeCells('A1:' . $this->lastColumn . '1');
                $sheet->setCellValue('A1', $this->reportInfo['title'] ?? 'LAPORAN SISWA TIDAK HADIR');

                $sheet->mergeCells('A2:' . $this->lastColumn . '2');
                $sheet->setCellValue('A2', 'SMK YAPIA PARUNG');
                
                $sheet->mergeCells('A3:' . $this->lastColumn . '3');
                $sheet->setCellValue('A3', 'Tanggal: ' . ($this->reportInfo['tanggal'] ?? 'N/A'));

                $headerStyle = [
                    'font' => ['bold' => true, 'size' => 12],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ];
                $sheet->getStyle('A1:A3')->applyFromArray($headerStyle);
                $sheet->getStyle('A3')->getFont()->setBold(false)->setSize(11);
            },
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $headerRow = 4;
        $headerRange = 'A' . $headerRow . ':' . $this->lastColumn . $headerRow;

        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => '000000']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'C4D79B']
            ],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
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
        
        $dataStartRow = $headerRow + 1;
        $sheet->getStyle('A' . $dataStartRow . ':A' . $this->totalRows)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C' . $dataStartRow . ':D' . $this->totalRows)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('E' . $dataStartRow . ':F' . $this->totalRows)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    }
}