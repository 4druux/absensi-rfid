<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pertemuan extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'tahun_ajaran',
        'gender',
        'kelas_id',
        'tanggal_pertemuan',
    ];

    protected $casts = [
        'tanggal_pertemuan' => 'date',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function titikAbsen()
    {
        return $this->belongsToMany(TitikAbsen::class, 'pertemuan_titik_absen', 'pertemuan_id', 'titik_absen_id');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}