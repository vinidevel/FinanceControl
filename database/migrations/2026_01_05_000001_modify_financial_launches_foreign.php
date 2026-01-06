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
            // drop existing foreign key (created originally with cascade)
            $table->dropForeign(['financial_flow_id']);
            // recreate with restrict to prevent parent deletion when children exist
            $table->foreign('financial_flow_id')->references('id')->on('financial_flows')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('financial_launches', function (Blueprint $table) {
            $table->dropForeign(['financial_flow_id']);
            $table->foreign('financial_flow_id')->references('id')->on('financial_flows')->onDelete('cascade');
        });
    }
};