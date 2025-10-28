<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Rekap Absensi Tahun Ajaran {{ $tahunAjaran }}</title>
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

        h4 {
            font-size: 12px;
            margin: 3px 0;
            font-weight: normal;
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

        .class-header {
            background-color: #e0e0e0;
            padding: 10px;
            margin-top: 30px;
            margin-bottom: 15px;
            text-align: center;
            border: 1px solid #ccc;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>LAPORAN REKAPITULASI ABSENSI KESELURUHAN</h1>
            <h2>Tahun Ajaran: {{ $tahunAjaran }}</h2>
        </div>

        @forelse ($yearData as $kelasId => $classData)
            @php
                $kelasInfo = $kelasInfoList->get($kelasId);
                if (!$kelasInfo) {
                    continue;
                }
                $namaKelasLengkap = $kelasInfo->nama_kelas . ' ' . $kelasInfo->kelompok;
                $namaJurusan = $kelasInfo->jurusan ? $kelasInfo->jurusan->nama_jurusan : 'N/A';
            @endphp

            <div class="class-header">
                <h3>Kelas: {{ $namaKelasLengkap }} ({{ $namaJurusan }})</h3>
            </div>

            @foreach ($classData as $gender => $genderData)
                @php
                    $genderLabel = $gender === 'L' ? 'Laki-laki' : 'Perempuan';
                    $pertemuanList = $genderData['pertemuan_list'];
                    $siswaData = $genderData['siswa_data'];
                @endphp

                <h4>Rekapitulasi Siswa: {{ $genderLabel }}</h4>

                @if ($pertemuanList->isEmpty() || $siswaData->isEmpty())
                    <p style="text-align:center; font-style:italic;">Tidak ada data absensi untuk {{ $genderLabel }} di
                        kelas ini.</p>
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
            @endforeach
            @if (!$loop->last)
                <div class="page-break"></div>
            @endif

        @empty
            <p style="text-align:center; font-weight:bold; margin-top: 50px;">Tidak ada data absensi yang ditemukan untuk
                tahun ajaran {{ $tahunAjaran }}.</p>
        @endforelse

    </div>
</body>

</html>
