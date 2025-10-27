<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('room_id');
            $table->unsignedBigInteger('user_id');
            $table->dateTime('check_in');
            $table->dateTime('check_out');
            $table->dateTime('booked_at')->useCurrent();
            $table->decimal('price', 12, 2);
            $table->string('invoice_id')->unique();
            $table->enum('status', ['đã đặt phòng', 'đã xác nhận', 'đã thanh toán', 'đã hủy'])->default('đã đặt phòng');
            $table->timestamps();

            // liên kết khóa ngoại
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
