<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSuggestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('suggestions', function (Blueprint $table) {
            $table->id();

            // Khóa ngoại liên kết với bảng users
            $table->unsignedBigInteger('user_id')->nullable(); 
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Nếu vẫn muốn lưu tên + email thủ công ngoài user_id
            $table->string('name')->nullable();
            $table->string('email')->nullable();

            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('suggestions');
    }
}
