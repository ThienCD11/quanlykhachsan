<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Suggestion;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422); // 422 Unprocessable Entity
        }

        // 2. Create and save the suggestion if validation passes
        try {
            $suggestion = Suggestion::create($validator->validated()); // Use validated data

            // 3. Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Góp ý của bạn đã được gửi thành công!',
                'data' => $suggestion
            ], 201); // 201 Created

        } catch (\Exception $e) {
            // Handle potential database errors
            \Log::error('Error saving suggestion: '.$e->getMessage()); // Log the error
            return response()->json([
                'success' => false,
                'message' => 'Đã có lỗi xảy ra khi gửi góp ý. Vui lòng thử lại.'
            ], 500); // 500 Internal Server Error
        }
    }
}
