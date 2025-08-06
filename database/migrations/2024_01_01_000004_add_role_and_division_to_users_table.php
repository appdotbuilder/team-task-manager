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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'administrator',
                'manager', 
                'division_member',
                'individual_user'
            ])->default('individual_user')->after('email');
            
            $table->foreignId('division_id')
                ->nullable()
                ->after('role')
                ->constrained('divisions')
                ->onDelete('set null');
                
            // Indexes for performance
            $table->index('role');
            $table->index(['role', 'division_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropColumn(['role', 'division_id']);
        });
    }
};