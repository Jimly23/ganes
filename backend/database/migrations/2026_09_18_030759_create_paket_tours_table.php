<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('paket_tours', function (Blueprint $table) {
            $table->id();
            $table->string('nama_paket_tour');
            $table->text('deskripsi_singkat');
            $table->json('lokasi_wisata')->nullable();
            $table->json('destinasi_wisata')->nullable();
            $table->decimal('harga', 15, 2);
            $table->json('fasilitas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paket_tours');
    }
};
