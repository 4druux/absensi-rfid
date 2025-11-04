<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pertemuan_titik_absen', function (Blueprint $table) {
            $table->foreignId('titik_absen_id')->constrained('titik_absens')->onDelete('cascade');
            $table->foreignId('pertemuan_id')->constrained('pertemuans')->onDelete('cascade');
            $table->primary(['titik_absen_id', 'pertemuan_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pertemuan_titik_absen');
    }
};