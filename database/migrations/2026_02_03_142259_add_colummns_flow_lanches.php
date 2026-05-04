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
            Schema::table('financial_launches', function (Blueprint $table) {
            $table->decimal('net_worth', 15, 2)->default(0);
            $table->date('card_expiration_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('financial_launches', function (Blueprint $table) {
            $table->dropColumn('net_worth');
            $table->dropColumn('card_expiration_date');
        });
    }
};
