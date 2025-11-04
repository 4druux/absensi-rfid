<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
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
            'kelas_id' => 'required|integer|exists:kelas,id',
        ]);

        $pertemuans = Pertemuan::where('tahun_ajaran', $validated['tahun_ajaran'])
            ->where('gender', $validated['gender'])
            ->where('kelas_id', $validated['kelas_id'])
            ->with('titikAbsen')
            ->orderBy('created_at', 'asc')
            ->orderBy('tanggal_pertemuan', 'asc')
            ->get();

        $pertemuans->each(function ($pertemuan) {
            $pertemuan->is_active = $pertemuan->titikAbsen->isNotEmpty();
            unset($pertemuan->titikAbsen);
        });

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
                            ->where('gender', $request->gender)
                            ->where('kelas_id', $request->kelas_id);
                    }),
                ],
                'tahun_ajaran' => 'required|string|exists:academic_years,year',
                'gender' => ['required', Rule::in(['L', 'P'])],
                'kelas_id' => 'required|integer|exists:kelas,id',
                'tanggal_pertemuan' => 'nullable|date_format:Y-m-d',
            ], [
                'title.unique' => 'Judul pertemuan ini sudah ada untuk kelas ini.'
            ]);

            if (empty($validated['tanggal_pertemuan'])) {
                $validated['tanggal_pertemuan'] = now()->toDateString();
            }

            $pertemuan = null;
            DB::transaction(function () use ($validated, &$pertemuan) {
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

   public function storeBulk(Request $request)
   {
        try {
            $validated = $request->validate([
                  'title' => 'required|string|max:255',
                  'tahun_ajaran' => 'required|string|exists:academic_years,year',
                  'gender' => ['required', Rule::in(['L', 'P'])],
                  'tanggal_pertemuan' => 'nullable|date_format:Y-m-d',
            ]);

            if (empty($validated['tanggal_pertemuan'])) {
                  $validated['tanggal_pertemuan'] = now()->toDateString();
            }

            $kelasIds = Kelas::whereHas('siswas.academicYear', function ($query) use ($validated) {
                $query->where('year', $validated['tahun_ajaran']);
                })->pluck('id');

            if ($kelasIds->isEmpty()) {
                  return response()->json(['message' => 'Tidak ada kelas ditemukan untuk tahun ajaran ini.'], 404);
            }

            $createdCount = 0;
            $skippedCount = 0;
            $dataToInsert = [];

            foreach ($kelasIds as $kelas_id) {
                  $data = [
                     'title' => $validated['title'],
                     'tahun_ajaran' => $validated['tahun_ajaran'],
                     'gender' => $validated['gender'],
                     'kelas_id' => $kelas_id,
                     'tanggal_pertemuan' => $validated['tanggal_pertemuan'],
                     'created_at' => now(),
                     'updated_at' => now(),
                  ];
                  
                  $exists = Pertemuan::where('title', $data['title'])
                     ->where('tahun_ajaran', $data['tahun_ajaran'])
                     ->where('gender', $data['gender'])
                     ->where('kelas_id', $data['kelas_id'])
                     ->exists();

                  if (!$exists) {
                     $dataToInsert[] = $data;
                     $createdCount++;
                  } else {
                     $skippedCount++;
                  }
            }

            if (!empty($dataToInsert)) {
                  Pertemuan::insert($dataToInsert);
            }

            $message = "{$createdCount} pertemuan berhasil ditambahkan.";
            if ($skippedCount > 0) {
                  $message .= " {$skippedCount} kelas dilewati karena judul sudah ada.";
            }

            return response()->json(['message' => $message], 201);

       } catch (ValidationException $e) {
            return response()->json([
                  'message' => $e->getMessage(),
                  'errors' => $e->errors(),
            ], 422);
       } catch (\Exception $e) {
            Log::error("Gagal storeBulk Pertemuan: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan internal saat membuat data massal.'], 500);
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
                            ->where('gender', $pertemuan->gender)
                            ->where('kelas_id', $pertemuan->kelas_id);
                    })->ignore($pertemuan->id),
                ],
                'tanggal_pertemuan' => 'nullable|date_format:Y-m-d',
            ], [
                'title.unique' => 'Judul pertemuan ini sudah ada untuk kelas ini.'
            ]);
            
            if ($request->filled('tanggal_pertemuan') && empty($validated['tanggal_pertemuan'])) {
                 $validated['tanggal_pertemuan'] = now()->toDateString();
            }

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
        if ($pertemuan->titikAbsen()->exists()) {
             return response()->json(['message' => 'Pertemuan tidak dapat dihapus karena sedang aktif di Titik Absen.'], 409);
        }

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

    public function getPertemuanByYear($tahun_ajaran)
    {
        if (!preg_match('/^\d{4}-\d{4}$/', $tahun_ajaran)) {
        abort(400, 'Format tahun ajaran tidak valid.');
        }

       $pertemuan = Pertemuan::where('pertemuans.tahun_ajaran', $tahun_ajaran)
        ->join('kelas', 'pertemuans.kelas_id', '=', 'kelas.id') 
        ->orderBy('pertemuans.gender')
        ->orderBy(DB::raw('COALESCE(pertemuans.tanggal_pertemuan, pertemuans.created_at)'), 'asc')
        ->select(
            'pertemuans.id',
            'pertemuans.gender',
            'pertemuans.title',
            DB::raw("DATE_FORMAT(COALESCE(pertemuans.tanggal_pertemuan, pertemuans.created_at), '%d/%m/%Y') as tanggal"),
            'kelas.nama_kelas', 
            'kelas.kelompok' 
        )
        ->get();

        return response()->json($pertemuan);
    }

    public function getPertemuanByKelas(Request $request, Kelas $kelas)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string|exists:academic_years,year',
        ]);

        $tahun_ajaran = $request->tahun_ajaran;

        $pertemuan = Pertemuan::where('tahun_ajaran', $tahun_ajaran)
        ->where('kelas_id', $kelas->id)
        ->orderBy('gender')
        ->orderBy(DB::raw('COALESCE(tanggal_pertemuan, created_at)'), 'asc')
        ->select(
            'id',
            'gender',
            'title',
            DB::raw("DATE_FORMAT(COALESCE(tanggal_pertemuan, created_at), '%d/%m/%Y') as tanggal")
        )
        ->get();

        return response()->json($pertemuan);
    }
}