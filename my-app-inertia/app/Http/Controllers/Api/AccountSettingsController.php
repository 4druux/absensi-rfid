<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AccountSettingsController extends Controller
{
    public function updateApi(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        try {
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'current_password' => ['nullable', 'required_with:password', 'string'],
                'password' => ['nullable', 'required_with:current_password', 'confirmed', Password::defaults()],
            ], [
                'name.required' => 'Nama tidak boleh kosong.',
                'current_password.required_with' => 'Password lama wajib diisi jika ingin mengubah password.',
                'password.required_with' => 'Password baru wajib diisi jika mengisi password lama.',
                'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
            ]);

            $updateData = ['name' => $request->name];

            if ($request->filled('password') && $request->filled('current_password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    throw ValidationException::withMessages([
                        'current_password' => ['Password lama yang Anda masukkan salah.'],
                    ]);
                }
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'message' => 'Pengaturan akun berhasil diperbarui.',
                'user' => $user->fresh(),
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error("Gagal update Account Settings: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan internal saat memperbarui akun.'], 500);
        }
    }
}