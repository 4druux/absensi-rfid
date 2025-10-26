<?php

namespace App\Http\Controllers\Api\DataSiswa;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function getAcademicYears()
    {
        return response()->json(AcademicYear::orderBy('year', 'desc')->get());
    }

    public function getAcademicYearsWithClasses()
    {
        $years = AcademicYear::whereHas('siswas')
                ->orderBy('year', 'desc')
                ->get();

        return response()->json($years);
    }

    public function createAcademicYear(Request $request)
    {
        $validated = $request->validate([
            'year' => ['required', 'string', 'max:9', 'unique:academic_years', 'regex:/^\d{4}[-\/]\d{4}$/'],
        ]);

        $academicYear = AcademicYear::create($validated);

        return response()->json(['message' => 'Tahun ajaran berhasil ditambahkan.', 'academic_year' => $academicYear], 201);
    }

    public function deleteAcademicYear($year)
    {
        $academicYear = AcademicYear::where('year', $year)->firstOrFail();
        $academicYear->delete();

        return response()->json(['message' => 'Tahun ajaran berhasil dihapus.']);
    }
}
