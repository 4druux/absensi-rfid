<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = ['siswa_id', 'waktu_absen', 'pertemuan_id', 'status'];

    public $timestamps = false;

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function pertemuan()
    {
        return $this->belongsTo(Pertemuan::class);
    }
}