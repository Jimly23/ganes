<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaketTour extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_paket_tour',
        'kategori',
        'deskripsi_singkat',
        'lokasi_wisata',
        'destinasi_wisata',
        'harga',
        'fasilitas',
    ];

    protected $casts = [
        'lokasi_wisata' => 'array',
        'destinasi_wisata' => 'array',
        'fasilitas' => 'array',
        'harga' => 'decimal:2',
    ];

    public function images()
    {
        return $this->hasMany(PaketTourImage::class);
    }
}
