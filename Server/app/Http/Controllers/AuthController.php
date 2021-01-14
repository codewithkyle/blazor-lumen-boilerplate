<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use \Firebase\JWT\JWT;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required'
        ]);
        if ($validator->fails()){
            return response()->json([
                "success" => false,
                "data" => $validator->errors(),
                "error" => "Login form contains errors."
            ]);
        }

        $email = $request->input("email");
        $password = $request->input("password");
        $user = User::where('email', $email)->first();

        if (Hash::check($password, $user->password)){
            return $this->generateToken($user->id);
        } else {
            return response()->json([
                "success" => false,
                "data" => null,
                "error" => "Incorrect email or password."
            ]);
        }
    }

    public function profile(Request $request): JsonResponse
    {
        $user = $request->user;

        return response()->json([
            "success" => true,
            "data" => $user,
            "error" => null,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json([
            "success" => true,
            "data" => null,
            "error" => null,
        ]);
    }

    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(auth()->refresh());
    }

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "email" => "required|email|unique:users|max:255",
            "password" => "required|min:6"
        ]);
        if ($validator->fails()){
            return response()->json([
                "success" => false,
                "data" => $validator->errors(),
                "error" => "Registration form contains errors."
            ]);
        }

        $email = $request->input("email");
        $password = Hash::make($request->input("password"));

        $user = User::create([
            "email" => $email,
            "password" => $password,
        ]);

        return response()->json([
            "success" => true,
            "data" => null,
            "error" => null,
        ]);
    }

    protected function generateToken(int $userId): JsonResponse
    {
        $iat = time();
        $payload = [
            "iss" => env("APP_URL"),
            "iat" => $iat,
            "nbf" => $iat,
            "exp" => $iat + 900,
            "sub" => $userId,
        ];
        $token = JWT::encode($payload, env("JWT_SECRET"), 'HS256');
        return response()->json([
            "success" => true,
            "data" => [
                'token' => $token,
                'type' => 'bearer',
                'expires' => $iat + 900
            ],
            "error" => null,
        ]);
    }
}
