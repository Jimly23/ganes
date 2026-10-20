<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paket_tours', function (Blueprint $table) {
            $table->string('kategori')->default('Travel Domestik')->after('nama_paket_tour');
        });

        Schema::table('tours', function (Blueprint $table) {
            $table->string('kategori')->default('Travel Domestik')->after('nama_tour');
        });
    }

    public function down(): void
    {
        Schema::table('paket_tours', function (Blueprint $table) {
            $table->dropColumn('kategori');
        });

        Schema::table('tours', function (Blueprint $table) {
            $table->dropColumn('kategori');
        });
    }
};
