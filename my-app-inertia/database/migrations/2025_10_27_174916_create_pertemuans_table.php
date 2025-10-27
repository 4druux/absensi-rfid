<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pertemuans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('tahun_ajaran');
            $table->enum('gender', ['L', 'P']);
            $table->boolean('is_active')->default(false);
            $table->timestamps();
            $table->index(['tahun_ajaran', 'gender']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pertemuans');
    }
};