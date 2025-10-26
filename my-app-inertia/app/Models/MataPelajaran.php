<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    protected $fillable = ['nama_mapel', 'kode_mapel'];

    public function jadwalSlots()
    {
        return $this->hasMany(JadwalSlot::class);
    }

    public function soals()
    {
        return $this->hasMany(Soal::class);
    }
}
