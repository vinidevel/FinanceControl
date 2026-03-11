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
        Schema::create('investiments', function (Blueprint $table) {
            $table->id();
            $table->string('investiment_name');
            $table->decimal('value', 15, 2);
            $table->foreignId('financial_launch_id')->constrained('financial_launches')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investiments');
    }
};
