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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('image_path');
            $table->date('due_date');
            $table->enum('priority_level', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', [
                'belum_dimulai',
                'sedang_dikerjakan', 
                'di_tinjau',
                'diterima',
                'selesai'
            ])->default('belum_dimulai');
            
            // Assignment type - either to division or specific user
            $table->enum('assignment_type', ['division', 'user']);
            $table->foreignId('assigned_division_id')
                ->nullable()
                ->constrained('divisions')
                ->onDelete('cascade');
            $table->foreignId('assigned_user_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('cascade');
            
            // Who created the task (should be manager)
            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('cascade');
                
            // Who is currently working on it
            $table->foreignId('taken_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            
            // Initial time estimates provided by manager
            $table->json('initial_time_estimates');
            
            // Current time estimate (can be revised by worker)
            $table->integer('current_time_estimate')->nullable();
            
            // Number of items completed
            $table->integer('items_completed')->default(0);
            
            // Work result image path
            $table->string('work_result_image')->nullable();
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index('status');
            $table->index('priority_level');
            $table->index('due_date');
            $table->index(['assignment_type', 'assigned_division_id']);
            $table->index(['assignment_type', 'assigned_user_id']);
            $table->index('created_by');
            $table->index('taken_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};