<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

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

    public function deleteProfile(Request $request): JsonResponse
    {
        $user = $request->user;
        $userService = new UserService($user);
        $userService->delete();
        return $this->buildSuccessResponse();
    }

    public function updateProfileAvatar(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "file" => "required",
        ]);
        if ($validator->fails()) {
            return $this->buildValidationErrorResponse($validator, "Form contains errors.");
        }
        $photo = $request->input("file");
        $file = $this->parseBase64Image($photo);
        $user = $request->user;
        $userService = new UserService($user);
        try {
            $userService->updateAvatar($file);
        } catch (Exception $e) {
            return $this->buildErrorResponse($e->getMessage());
        }
        return $this->buildSuccessResponse();
    }
}
