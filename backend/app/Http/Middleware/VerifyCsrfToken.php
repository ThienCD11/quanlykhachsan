<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // THÊM DÒNG NÀY: Cho phép React gọi API mà không bị chặn
        'api/*', 
        'payment-return', // Nếu bạn có route này cho return
    ];
}