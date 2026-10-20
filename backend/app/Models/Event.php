<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul_event',
        'gambar',
        'deskripsi_event',
        'itinerary',
        'fasilitas',
        'syarat_dan_ketentuan',
        'harga_asli',
        'harga_promo',
        'tanggal',
    ];

    protected $casts = [
        'fasilitas' => 'array',
        'tanggal' => 'array',
        'harga_asli' => 'decimal:2',
        'harga_promo' => 'decimal:2',
    ];
}
