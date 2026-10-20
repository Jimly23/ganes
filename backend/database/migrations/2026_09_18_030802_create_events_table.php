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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('judul_event');
            $table->string('gambar')->nullable();
            $table->text('deskripsi_event');
            $table->text('itinerary')->nullable();
            $table->json('fasilitas')->nullable();
            $table->text('syarat_dan_ketentuan')->nullable();
            $table->decimal('harga_asli', 15, 2)->nullable();
            $table->decimal('harga_promo', 15, 2)->nullable();
            $table->json('tanggal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
