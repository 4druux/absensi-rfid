<!DOCTYPE html>
<html>

<body>
    <div class="container">
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Jenis Kelamin</th>
                    <th>RFID</th>
                    <th>Status</th>
                    <th>Tanggal Absen</th>
                    <th>Waktu Absen</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($records as $index => $record)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $record['nama'] }}</td>

                        <td>
                            @if (isset($record['jenis_kelamin']))
                                {{ $record['jenis_kelamin'] === 'L' ? 'Laki-laki' : 'Perempuan' }}
                            @else
                                -
                            @endif
                        </td>

                        <td>{{ $record['rfid'] ?? '-' }}</td>
                        <td>{{ $record['status'] }}</td>
                        <td>{{ $record['tanggal_absen'] ?? '-' }}</td>
                        <td>{{ $record['waktu_absen'] ?? '-' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="text-align: center">
                            Tidak ada data absensi.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</body>

</html>
