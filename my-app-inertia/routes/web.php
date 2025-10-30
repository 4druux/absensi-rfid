<?php

use App\Http\Controllers\Api\AttendanceController;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/login', 'Auth/LoginPage')->name('login')->middleware('guest');
Route::inertia('/register', 'Auth/RegisterPage')->name('register')->middleware('guest');

Route::inertia('/monitor', 'MonitorPage')->name('monitor')->middleware('prevent.caching');

Route::middleware(['auth', 'prevent.caching'])->group(function () {
    Route::inertia('/', 'HomePage')->name('home');

    Route::prefix('data-siswa')->name('data-siswa.')->group(function () {
        Route::inertia('/', 'DataSiswa/SelectClass')->name('index');
        Route::inertia('/input', 'DataSiswa/InputData')->name('input');
        Route::inertia('/show', 'DataSiswa/ShowClass')->name('show');
    });

    Route::prefix('manajemen-akun')->name('manajemen-akun.')->group(function () {
        Route::inertia('/', 'ManajemenAkun/SelectAccount')->name('index');
        Route::inertia('/show', 'ManajemenAkun/ShowAccount')->name('show');
    });

    Route::prefix('absensi-siswa')->name('absensi-siswa.')->group(function () {
        Route::inertia('/', 'Absensi/SelectYears')->name('years');    
        Route::get('/{tahun_ajaran}', function ($tahun_ajaran) {
            return Inertia::render('Absensi/SelectClass', [
                'tahun_ajaran' => $tahun_ajaran, 
            ]);
        })->name('class');

        Route::get('/gender/{kelas_id}', function ($kelas_id, Request $request) {
            return Inertia::render('Absensi/SelectGender', [
                'kelas_id' => $kelas_id,
                'tahun_ajaran' => $request->input('tahun_ajaran'),
                'nama_kelas' => $request->input('nama_kelas'),
                'nama_jurusan' => $request->input('nama_jurusan'),
            ]);
        })->name('gender');

        Route::get('/pertemuan/{gender}', function ($gender, Request $request) {
            return Inertia::render('Absensi/SelectMeet', [
                'gender' => $gender,
                'kelas_id' => $request->input('kelas_id'),
                'tahun_ajaran' => $request->input('tahun_ajaran'),
                'nama_kelas' => $request->input('nama_kelas'),
                'nama_jurusan' => $request->input('nama_jurusan'),
            ]);
        })->name('pertemuan');

        Route::get('/show/{pertemuan_id}', function ($pertemuan_id, Request $request) {
            return Inertia::render('Absensi/ShowAttendance', [ 
                'pertemuan_id' => $pertemuan_id,
                'kelas_id' => $request->input('kelas_id'),
                'gender' => $request->input('gender'),
                'tahun_ajaran' => $request->input('tahun_ajaran'),
                'nama_kelas' => $request->input('nama_kelas'),
                'nama_jurusan' => $request->input('nama_jurusan'),
            ]);
        })->name('show');
    });

    Route::get('/export/pdf/{pertemuan}', [
        AttendanceController::class,
        'exportAtendanceByMeetPdf',
    ])->name('attendance.meet.export.pdf');

    Route::get('/export/excel/{pertemuan}', [
        AttendanceController::class,
        'exportAtendanceByMeetExcel',
    ])->name('attendance.meet.export.excel');

    Route::get('/export/class/pdf/{kelas}', [
        AttendanceController::class,
        'exportAtendanceByClassPdf',
    ])->name('attendance.class.export.pdf');

    Route::get('/export/class/excel/{kelas}', [
        AttendanceController::class,
        'exportAtendanceByClassExcel',
    ])->name('attendance.class.export.excel');

    Route::get('/export/year/pdf/{tahun_ajaran}', [
        AttendanceController::class,
        'exportYearReportPdf',
    ])->name('attendance.export.year.pdf');

    Route::get('/export/year/excel/{tahun_ajaran}', [
        AttendanceController::class,
        'exportYearReportExcel',
    ])->name('attendance.export.year.excel');
    Route::get('/export/year/absent/pdf/{tahun_ajaran}', [
        AttendanceController::class,
        'exportYearReportAbsentPdf',
    ])->name('attendance.export.year.absent.pdf');

    Route::get('/export/year/absent/excel/{tahun_ajaran}', [
        AttendanceController::class,
        'exportYearReportAbsentExcel',
    ])->name('attendance.export.year.absent.excel');

    Route::inertia('/pengaturan-akun', 'Auth/AccountSettingsPage')->name('account.settings');
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage');
});