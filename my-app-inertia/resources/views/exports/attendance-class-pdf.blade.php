<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Laporan Absensi Kelas</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 10px;
        }

        .container {
            width: 100%;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        h1 {
            font-size: 16px;
            margin: 0;
        }

        h2 {
            font-size: 14px;
            margin: 5px 0;
        }

        h3 {
            font-size: 13px;
            margin-top: 25px;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
            white-space: nowrap;
        }

        th {
            background-color: #f2f2f2;
            font-size: 11px;
        }

        .summary {
            margin-bottom: 15px;
            font-size: 12px;
        }

        .summary td {
            border: none;
            padding: 3px;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>LAPORAN REKAPITULASI ABSENSI</h1>
            <h2>Kelas: {{ $reportInfo['nama_kelas'] }} ({{ $reportInfo['nama_jurusan'] }})</h2>
            <h4>Tahun Ajaran: {{ $reportInfo['tahun_ajaran'] }}</h4>
        </div>

        @foreach ($data as $gender => $genderData)
            @php
                $genderLabel = $gender === 'L' ? 'Laki-laki' : 'Perempuan';
                $pertemuanList = $genderData['pertemuan_list'];
                $siswaData = $genderData['siswa_data'];
            @endphp

            <h3>Rekapitulasi Siswa: {{ $genderLabel }}</h3>

            @if ($pertemuanList->isEmpty() || $siswaData->isEmpty())
                <p>Tidak ada data absensi untuk {{ $genderLabel }}.</p>
            @else
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Siswa</th>
                            <th>RFID</th>
                            @foreach ($pertemuanList as $pertemuan)
                                <th>{{ $pertemuan->title }}</th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($siswaData as $index => $siswa)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td>{{ $siswa['nama'] }}</td>
                                <td>{{ $siswa['rfid'] ?? '-' }}</td>
                                @foreach ($siswa['status'] as $status)
                                    <td>{{ $status }}</td>
                                @endforeach
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif

            @if (!$loop->last)
                <div class="page-break"></div>
            @endif
        @endforeach
    </div>
</body>

</html>
