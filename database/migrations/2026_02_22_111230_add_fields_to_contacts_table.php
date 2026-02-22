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
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('status')->default('new')->after('message'); // new, read, replied, spam
            $table->string('ip_address')->nullable()->after('status');
            $table->timestamp('read_at')->nullable()->after('ip_address');
            $table->timestamp('replied_at')->nullable()->after('read_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn(['status', 'ip_address', 'read_at', 'replied_at']);
        });
    }
};
