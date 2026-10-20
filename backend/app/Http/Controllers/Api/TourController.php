<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\TourImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TourController extends Controller
{
    public function index()
    {
        $tours = Tour::with('images')->get();
        return response()->json([
            'status' => 'success',
            'data' => $tours
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_tour' => 'required|string|max:255',
            'kategori' => 'required|string|in:Travel Domestik,Travel Internasional',
            'deskripsi_singkat' => 'required|string',
            'lokasi_wisata' => 'nullable|string',
            'destinasi_wisata' => 'nullable|string',
            'harga' => 'required|numeric',
            'fasilitas' => 'nullable|array',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $tour = Tour::create($request->except('gambar'));

        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $image) {
                $path = $image->store('tours', 'public');
                $tour->images()->create([
                    'image_path' => $path
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tour created successfully',
            'data' => $tour->load('images')
        ], 201);
    }

    public function show(string $id)
    {
        $tour = Tour::with('images')->find($id);

        if (!$tour) {
            return response()->json(['status' => 'error', 'message' => 'Tour not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $tour
        ]);
    }

    public function update(Request $request, string $id)
    {
        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json(['status' => 'error', 'message' => 'Tour not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_tour' => 'sometimes|required|string|max:255',
            'kategori' => 'sometimes|required|string|in:Travel Domestik,Travel Internasional',
            'deskripsi_singkat' => 'sometimes|required|string',
            'lokasi_wisata' => 'nullable|string',
            'destinasi_wisata' => 'nullable|string',
            'harga' => 'sometimes|required|numeric',
            'fasilitas' => 'nullable|array',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $tour->update($request->except('gambar'));

        if ($request->hasFile('gambar')) {
            foreach ($tour->images as $img) {
                Storage::disk('public')->delete($img->image_path);
                $img->delete();
            }

            foreach ($request->file('gambar') as $image) {
                $path = $image->store('tours', 'public');
                $tour->images()->create([
                    'image_path' => $path
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tour updated successfully',
            'data' => $tour->load('images')
        ]);
    }

    public function destroy(string $id)
    {
        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json(['status' => 'error', 'message' => 'Tour not found'], 404);
        }

        foreach ($tour->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $tour->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tour deleted successfully'
        ]);
    }
}
