<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('titik_absens', function (Blueprint $table) {
            $table->id();
            $table->string('nama_titik');
            $table->string('identifier')->unique();
            $table->string('api_key')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('titik_absens');
    }
};