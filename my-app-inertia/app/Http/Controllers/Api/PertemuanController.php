<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pertemuan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

class PertemuanController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran' => 'required|string|exists:academic_years,year',
            'gender' => ['required', Rule::in(['L', 'P'])],
        ]);

        $pertemuans = Pertemuan::where('tahun_ajaran', $validated['tahun_ajaran'])
            ->where('gender', $validated['gender'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($pertemuans);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => [
                    'required', 'string', 'max:255',
                    Rule::unique('pertemuans')->where(function ($query) use ($request) {
                        return $query->where('tahun_ajaran', $request->tahun_ajaran)
                            ->where('gender', $request->gender);
                    }),
                ],
                'tahun_ajaran' => 'required|string|exists:academic_years,year',
                'gender' => ['required', Rule::in(['L', 'P'])],
            ], [
                'title.unique' => 'Judul pertemuan ini sudah ada untuk tahun ajaran dan gender tersebut.'
            ]);

            $pertemuan = null;
            DB::transaction(function () use ($validated, &$pertemuan) {
                 $validated['is_active'] = false;
                $pertemuan = Pertemuan::create($validated);
            });

            return response()->json(['message' => 'Pertemuan berhasil ditambahkan.', 'pertemuan' => $pertemuan], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error("Gagal store Pertemuan: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan internal.'], 500);
        }
    }

    public function show(Pertemuan $pertemuan)
    {
        return response()->json($pertemuan);
    }

    public function update(Request $request, Pertemuan $pertemuan)
    {
        try {
            $validated = $request->validate([
                'title' => [
                    'required', 'string', 'max:255',
                    Rule::unique('pertemuans')->where(function ($query) use ($pertemuan) {
                        return $query->where('tahun_ajaran', $pertemuan->tahun_ajaran)
                            ->where('gender', $pertemuan->gender);
                    })->ignore($pertemuan->id),
                ],
            ], [
                'title.unique' => 'Judul pertemuan ini sudah ada untuk tahun ajaran dan gender tersebut.'
            ]);

            DB::transaction(function () use ($validated, $pertemuan) {
                $pertemuan->update($validated);
            });

            return response()->json(['message' => 'Pertemuan berhasil diperbarui.', 'pertemuan' => $pertemuan]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error("Gagal update Pertemuan: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan internal.'], 500);
        }
    }

    public function destroy(Pertemuan $pertemuan)
    {
        DB::beginTransaction();
        try {
            $pertemuan->delete();
            DB::commit();
            return response()->json(['message' => 'Pertemuan berhasil dihapus.']);
        } catch (QueryException $e) {
            DB::rollBack();
            Log::error("Gagal delete Pertemuan (QueryException): " . $e->getMessage());
            if ($e->errorInfo[1] == 1451) {
                 return response()->json(['message' => 'Pertemuan tidak dapat dihapus karena sudah memiliki data absensi.'], 409);
            }
             return response()->json(['message' => 'Gagal menghapus, terjadi kesalahan database.'], 500);
        }
        catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal delete Pertemuan: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan internal.'], 500);
        }
    }

    public function setActive(Pertemuan $pertemuan)
    {
        try {
            $pertemuan->update(['is_active' => true]);
             return response()->json(['message' => 'Sesi pertemuan berhasil diaktifkan.', 'pertemuan' => $pertemuan->refresh()]);
        } catch (\Exception $e) {
            Log::error("Gagal setActive Pertemuan: " . $e->getMessage());
            return response()->json(['message' => 'Gagal mengaktifkan sesi.'], 500);
        }
    }

     public function setInactive(Pertemuan $pertemuan)
    {
         try {
            $pertemuan->update(['is_active' => false]);
            return response()->json(['message' => 'Sesi pertemuan berhasil dinonaktifkan.', 'pertemuan' => $pertemuan->refresh()]);
        } catch (\Exception $e) {
            Log::error("Gagal setInactive Pertemuan: " . $e->getMessage());
            return response()->json(['message' => 'Gagal menonaktifkan sesi.'], 500);
        }
    }

    public function getActiveStatus()
    {
        $isActive = Pertemuan::where('is_active', true)->exists();
        return response()->json(['is_active' => $isActive]);
    }

    public function getPertemuanByYear($tahun_ajaran)
    {
        if (!preg_match('/^\d{4}-\d{4}$/', $tahun_ajaran)) {
            abort(400, 'Format tahun ajaran tidak valid.');
        }

        $pertemuan = Pertemuan::where('tahun_ajaran', $tahun_ajaran)
            ->orderBy('gender')
            ->orderBy('created_at', 'asc')
            ->select(
                'id',
                'gender',
                DB::raw("CONCAT(title, ' (', DATE_FORMAT(created_at, '%d/%m/%Y'), ')') as title")
            )
            ->get();

        return response()->json($pertemuan);
    }
}