<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Các thuộc tính được phép gán hàng loạt (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        'address',
        'role',
        'is_active', // <--- Đã thêm cột mới
        'avatar',
    ];

    /**
     * Các thuộc tính nên được ẩn khỏi Serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Các thuộc tính nên được ép kiểu (Casting).
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean', // <--- Tùy chọn: Ép kiểu is_active sang boolean
    ];

    // --- ĐỊNH NGHĨA CÁC MỐI QUAN HỆ (Relationships) ---

    /**
     * Mối quan hệ với các đơn đặt phòng (Bookings).
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Mối quan hệ với các đánh giá (Reviews).
     * Cần thiết cho việc Xóa tầng (Cascading Delete).
     */
    public function reviews(): HasMany
    {
        // Bạn cần đảm bảo Model Review tồn tại
        return $this->hasMany(Review::class);
    }

    /**
     * Mối quan hệ với các gợi ý/phản hồi (Suggestions).
     * Cần thiết cho việc Xóa tầng (Cascading Delete).
     */
    public function suggestions(): HasMany
    {
        // Bạn cần đảm bảo Model Suggestion tồn tại
        return $this->hasMany(Suggestion::class);
    }
}