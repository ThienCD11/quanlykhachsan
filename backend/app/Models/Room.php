<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Booking;

class Room extends Model
{
    use HasFactory;

    protected $table = 'rooms';
    protected $fillable = ['name', 'price', 'capacity', 'area', 'about', 'image'];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
