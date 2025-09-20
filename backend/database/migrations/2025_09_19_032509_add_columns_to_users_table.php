<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // 1
            $table->string('name'); // 2
            $table->string('phone')->nullable(); // 3
            $table->string('email')->unique(); // 4
            $table->string('password'); // 5
            $table->string('role')->default('customer'); // 6
            $table->string('avatar')->nullable(); // 7
            $table->timestamp('email_verified_at')->nullable(); // 8
            $table->rememberToken(); // 9
            $table->timestamps(); // 10-11: created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
