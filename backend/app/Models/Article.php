<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul_artikel',
        'deskripsi_singkat',
        'tanggal_posting',
        'gambar',
        'isi_artikel',
    ];

    protected $casts = [
        'tanggal_posting' => 'date:Y-m-d',
    ];
}
