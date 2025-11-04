<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TitikAbsen extends Model
{
    use HasFactory;

    protected $table = 'titik_absens';

    protected $fillable = [
        'nama_titik',
        'identifier',
        'api_key',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->identifier)) {
                $model->identifier = Str::slug($model->nama_titik);
            }
            if (empty($model->api_key)) {
                $model->api_key = Str::random(40);
            }
        });
    }

    public function pertemuanAktif()
    {
        return $this->belongsToMany(Pertemuan::class, 'pertemuan_titik_absen', 'titik_absen_id', 'pertemuan_id');
    }
}