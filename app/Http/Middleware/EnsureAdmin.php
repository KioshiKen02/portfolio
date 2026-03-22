<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user('api');

        if (!$user || (int)$user->is_admin !== 1) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return $next($request);
    }
}

