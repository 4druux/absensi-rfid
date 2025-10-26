<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/login', 'Auth/LoginPage')->name('login')->middleware('guest');
Route::inertia('/register', 'Auth/RegisterPage')->name('register')->middleware('guest');

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
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage');
});