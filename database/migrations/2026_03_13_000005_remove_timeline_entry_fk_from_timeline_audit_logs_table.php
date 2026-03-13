<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('timeline_audit_logs', function (Blueprint $table) {
            $table->dropForeign(['timeline_entry_id']);
        });
    }

    public function down(): void
    {
        Schema::table('timeline_audit_logs', function (Blueprint $table) {
            $table->foreign('timeline_entry_id')->references('id')->on('timeline_entries')->nullOnDelete();
        });
    }
};

