<?php

namespace App\Http\Controllers\Api\DataSiswa;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use Illuminate\Http\Request;

class JurusanController extends Controller
{
    public function getJurusans()
    {
        return response()->json(Jurusan::orderBy('nama_jurusan')->get());
    }

    public function createJurusan(Request $request)
    {
        $validated = $request->validate([
            'nama_jurusan' => 'required|string|max:255|unique:jurusans'
        ]);

        $jurusan = Jurusan::create($validated);

        return response()->json(['message' => 'Jurusan berhasil ditambahkan.', 'jurusan' => $jurusan], 201);
    }

    public function deleteJurusan(Jurusan $jurusan)
    {
        $jurusan->delete();

        return response()->json(['message' => 'Jurusan berhasil dihapus.']);
    }
}
