<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\DataSiswa\AcademicYearController;
use App\Http\Controllers\Api\DataSiswa\DataSiswaController;
use App\Http\Controllers\Api\DataSiswa\JurusanController;
use App\Http\Controllers\Api\DataSiswa\KelasController;
use App\Http\Controllers\Api\UserManagementController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

// Rute Autentikasi
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Absensi
Route::post('/attendance/scan', [AttendanceController::class, 'scan']);
Route::get('/attendance/today', [AttendanceController::class, 'getTodaysAttendance']);

Route::middleware('auth:sanctum')->group(function () {
    // Jurusan
    Route::controller(JurusanController::class)->prefix('jurusan')->group(function () {
        Route::get('/', 'getJurusans');
        Route::post('/', 'createJurusan');
        Route::delete('/{jurusan}', 'deleteJurusan');
    });

    // Kelas
   Route::controller(KelasController::class)->group(function () {
        Route::prefix('kelas')->group(function () {
            Route::get('/', 'getKelas');
            Route::get('/{kelas}', 'showKelas');
            Route::post('/', 'createKelas');
            Route::delete('/{kelas}', 'deleteKelas');
        });

        Route::get('/jurusan/{jurusan}/kelas', 'getKelasByJurusan');
    });

    // Academic Year
    Route::controller(AcademicYearController::class)->prefix('academic-years')->group(function () {
        Route::get('/', 'getAcademicYears');
        Route::get('/with-classes', 'getAcademicYearsWithClasses');
        Route::post('/', 'createAcademicYear');
        Route::delete('/{year}', 'deleteAcademicYear');
    });

    // Siswa
    Route::controller(DataSiswaController::class)->prefix('siswa')->group(function () {
        Route::post('/', 'createSiswa');
        Route::post('/single', 'createSingleSiswa');
        Route::put('/{siswa}', 'updateSiswa');
        Route::delete('/{siswa}', 'deleteSiswa');
        Route::post('/promote', 'promoteStudents');
        Route::get('/all',  'getAllSiswa');
    });

    // Manajemen Akun
    Route::controller(UserManagementController::class)->prefix('users')->group(function () {
        Route::get('/', 'index');
        Route::put('/{user}', 'update');
        Route::delete('/{user}', 'destroy');
        Route::post('/{user}/approve', 'approve');
        Route::put('/{user}/reset-password', 'resetPassword');
    });
});
