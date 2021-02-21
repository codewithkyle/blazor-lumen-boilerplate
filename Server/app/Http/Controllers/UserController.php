<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user;

        return $this->buildSuccessResponse($user);
    }

    public function verify(Request $request): JsonResponse
    {
        return $this->buildSuccessResponse();
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|max:255",
            "email" => "required|email|max:255",
        ]);
        if ($validator->fails()) {
            return $this->buildValidationErrorResponse($validator, "Profile update form contains errors.");
        }

        $user = $request->user;
        $userService = new UserService($user);

        try {
            $userService->updateProfile($request->all());
        } catch (Exception $e) {
            return $this->buildErrorResponse($e->getMessage());
        }

        return $this->buildSuccessResponse();
    }
}
