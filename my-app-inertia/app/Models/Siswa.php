<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;
    protected $fillable = ['rfid', 'nama', 'jenis_kelamin', 'kelas_id', 'academic_year_id', 'user_id'];

    protected $appends = ['name'];

    public function getNameAttribute()
    {
        return $this->attributes['nama'];
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
