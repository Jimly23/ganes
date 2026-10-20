<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_tour',
        'kategori',
        'deskripsi_singkat',
        'lokasi_wisata',
        'destinasi_wisata',
        'harga',
        'fasilitas',
    ];

    protected $casts = [
        'fasilitas' => 'array',
        'harga' => 'decimal:2',
    ];

    public function images()
    {
        return $this->hasMany(TourImage::class);
    }
}
