<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');            
            $table->foreignId('pertemuan_id')
                  ->constrained('pertemuans')
                  ->onDelete('cascade');
            $table->timestamp('waktu_absen');
            $table->unique(['siswa_id', 'pertemuan_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};