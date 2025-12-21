<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ResetPasswordMail extends Mailable
{
    public $code;

    public function __construct($code)
    {
        $this->code = $code;
    }

    public function build()
    {
        return $this
            ->subject('Mã đặt lại mật khẩu')
            ->view('emails.reset-password');
    }
}
