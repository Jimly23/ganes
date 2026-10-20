<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaketTour;
use App\Models\PaketTourImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PaketTourController extends Controller
{
    public function index()
    {
        $paketTours = PaketTour::with('images')->get();
        return response()->json([
            'status' => 'success',
            'data' => $paketTours
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_paket_tour' => 'required|string|max:255',
            'kategori' => 'required|string|in:Travel Domestik,Travel Internasional',
            'deskripsi_singkat' => 'required|string',
            'lokasi_wisata' => 'nullable|array',
            'destinasi_wisata' => 'nullable|array',
            'harga' => 'required|numeric',
            'fasilitas' => 'nullable|array',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $paketTour = PaketTour::create($request->except('gambar'));

        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $image) {
                $path = $image->store('paket_tours', 'public');
                $paketTour->images()->create([
                    'image_path' => $path
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Paket Tour created successfully',
            'data' => $paketTour->load('images')
        ], 201);
    }

    public function show(string $id)
    {
        $paketTour = PaketTour::with('images')->find($id);

        if (!$paketTour) {
            return response()->json(['status' => 'error', 'message' => 'Paket Tour not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $paketTour
        ]);
    }

    public function update(Request $request, string $id)
    {
        $paketTour = PaketTour::find($id);

        if (!$paketTour) {
            return response()->json(['status' => 'error', 'message' => 'Paket Tour not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_paket_tour' => 'sometimes|required|string|max:255',
            'kategori' => 'sometimes|required|string|in:Travel Domestik,Travel Internasional',
            'deskripsi_singkat' => 'sometimes|required|string',
            'lokasi_wisata' => 'nullable|array',
            'destinasi_wisata' => 'nullable|array',
            'harga' => 'sometimes|required|numeric',
            'fasilitas' => 'nullable|array',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $paketTour->update($request->except('gambar'));

        // Optional: Replace all images or just add new ones. For simplicity, we add new ones here.
        // If the client wants to replace, they should call a separate delete image endpoint or we delete all existing.
        // Let's implement replacing all if 'gambar' is sent.
        if ($request->hasFile('gambar')) {
            // Delete old images physically and from db
            foreach ($paketTour->images as $img) {
                Storage::disk('public')->delete($img->image_path);
                $img->delete();
            }

            // Upload new images
            foreach ($request->file('gambar') as $image) {
                $path = $image->store('paket_tours', 'public');
                $paketTour->images()->create([
                    'image_path' => $path
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Paket Tour updated successfully',
            'data' => $paketTour->load('images')
        ]);
    }

    public function destroy(string $id)
    {
        $paketTour = PaketTour::find($id);

        if (!$paketTour) {
            return response()->json(['status' => 'error', 'message' => 'Paket Tour not found'], 404);
        }

        foreach ($paketTour->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $paketTour->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Paket Tour deleted successfully'
        ]);
    }
}
