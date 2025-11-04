<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rekap Absensi Tahun Ajaran {{ $tahunAjaran }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
        }

        .container {
            width: 100%;
            margin: 0 auto;
        }

        .header {
            margin-bottom: 20px;
        }

        .logo-container {
            display: inline-block;
            vertical-align: top;
            margin-right: 15px;
        }

        .logo-container img {
            height: 80px;
        }

        .header-text {
            display: inline-block;
            vertical-align: top;
            text-align: left;
        }

        .header-text h1,
        .header-text h2 {
            margin: 0;
        }

        h1 {
            font-size: 14px;
        }

        h2 {
            font-size: 12px;
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
            margin-top: 20px;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
            vertical-align: middle;
            white-space: nowrap;
        }

        th {
            background-color: #c4d79b;
            font-weight: bold;
            text-align: center;
        }

        .text-left {
            text-align: left;
        }

        .text-center {
            text-align: center;
        }

        .footer {
            text-align: center;
            font-size: 9px;
            color: #555;
            width: 100%;
            position: fixed;
            bottom: -30px;
        }

        .page-break {
            page-break-after: always;
        }

        .class-header {
            background-color: #c4d79b;
            text-align: center;
            padding-bottom: 5px;
            padding-top: 1px;
            margin-bottom: 10px;
        }

        .legend-table {
            width: auto;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 10px;
        }

        .legend-table th,
        .legend-table td {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            @if (isset($logoPath) && file_exists(public_path($logoPath)))
                <div class="logo-container">
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path($logoPath))) }}"
                        alt="Logo SMK">
                </div>
            @endif

            <div class="header-text">
                <h1>LAPORAN ABSENSI KESELURUHAN</h1>
                <h2>SMK YAPIA PARUNG</h2>
                <h2>Tahun Ajaran: {{ $tahunAjaran }}</h2>
            </div>
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
                <h3 style="margin-top: 10px;">{{ $namaKelasLengkap }} - {{ $namaJurusan }}</h3>
            </div>

            @foreach ($classData as $gender => $genderData)
                @php
                    $genderLabel = $gender === 'L' ? 'Laki-laki' : 'Perempuan';
                    $pertemuanList = $genderData['pertemuan_list'];
                    $siswaData = $genderData['siswa_data'];
                @endphp

                <h4>Siswa: <span style="font-weight:700">{{ $genderLabel }}</span></h4>

                @if ($pertemuanList->isEmpty() || $siswaData->isEmpty())
                    <p style="text-align:center; font-style:italic;">Tidak ada data absensi untuk {{ $genderLabel }} di
                        kelas ini.</p>
                @else
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 5%;">No</th>
                                <th style="width: 30%;">Nama Siswa</th>
                                <th style="width: 15%;">RFID</th>
                                @foreach ($pertemuanList as $pertemuan)
                                    <th>
                                        {{ $pertemuan->title }} <br>
                                        <span
                                            style="font-weight: normal; font-size: 9px;">({{ $pertemuan->tanggal }})</span>
                                    </th>
                                @endforeach
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($siswaData as $index => $siswa)
                                <tr>
                                    <td class="text-center">{{ $loop->iteration }}</td>
                                    <td class="text-left">{{ $siswa['nama'] }}</td>
                                    <td class="text-center">{{ $siswa['rfid'] ?? '-' }}</td>
                                    @foreach ($siswa['status'] as $status)
                                        <td class="text-center">
                                            @switch($status)
                                                @case('Hadir')
                                                    ✓
                                                @break

                                                @case('Telat')
                                                    T
                                                @break

                                                @case('Sakit')
                                                    S
                                                @break

                                                @case('Izin')
                                                    I
                                                @break

                                                @case('Bolos')
                                                    B
                                                @break

                                                @default
                                                    A
                                            @endswitch
                                        </td>
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
                <p style="text-align:center; font-weight:bold; margin-top: 50px;">Tidak ada data absensi yang ditemukan
                    untuk
                    tahun ajaran {{ $tahunAjaran }}.</p>
            @endforelse
        </div>

        <table class="legend-table">
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>✓</td>
                    <td>Hadir</td>
                </tr>
                <tr>
                    <td>T</td>
                    <td>Telat</td>
                </tr>
                <tr>
                    <td>S</td>
                    <td>Sakit</td>
                </tr>
                <tr>
                    <td>I</td>
                    <td>Izin</td>
                </tr>
                <tr>
                    <td>B</td>
                    <td>Bolos</td>
                </tr>
                <tr>
                    <td>A</td>
                    <td>Alfa</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            Laporan ini dibuat secara otomatis oleh Sistem Absensi SMK Yapia Parung
        </div>
    </body>

    </html>
