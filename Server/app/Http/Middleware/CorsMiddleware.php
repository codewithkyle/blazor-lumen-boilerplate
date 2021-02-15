<?php

namespace App\Http\Middleware;

class CorsMiddleware
{
    public function handle($request, \Closure $next)
    {
        $response = $next($request);

        $origin = rtrim(getenv("APP_URL"), "/");

        $response->header("Access-Control-Allow-Methods", "HEAD, GET, POST, PUT, PATCH, DELETE");
        $response->header("Access-Control-Allow-Headers", "Content-Type, Accpets");
        $response->header("Access-Control-Allow-Origin", $origin);
        $response->header("Access-Control-Allow-Credentials", "true");

        $headers = [
            "Access-Control-Allow-Origin" => $origin,
            "Access-Control-Allow-Methods" => "POST, GET, OPTIONS, PUT, DELETE",
            "Access-Control-Allow-Credentials" => "true",
            "Access-Control-Max-Age" => "86400",
            "Access-Control-Allow-Headers" => "Content-Type, Authorization, X-Requested-With, Accept",
        ];

        if ($request->isMethod("OPTIONS")) {
            return response()->json('{"method":"OPTIONS"}', 200, $headers);
        }

        return $response;
    }
}
