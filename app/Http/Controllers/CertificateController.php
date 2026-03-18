<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CertificateController extends Controller
{
    public function index()
    {
        return Cache::remember('certificates.index', now()->addDay(), function () {
            return Certificate::orderBy('sort_order')->orderByDesc('created_at')->get();
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'date' => 'nullable|string|max:255',
            'photo' => 'nullable|string',
            'type' => 'required|in:certification,seminar',
            'sort_order' => 'integer',
        ]);

        $certificate = Certificate::create($validated);
        
        Cache::forget('certificates.index');

        return response()->json($certificate, 201);
    }

    public function update(Request $request, Certificate $certificate)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'issuer' => 'string|max:255',
            'date' => 'nullable|string|max:255',
            'photo' => 'nullable|string',
            'type' => 'in:certification,seminar',
            'sort_order' => 'integer',
        ]);

        $certificate->update($validated);
        
        Cache::forget('certificates.index');

        return response()->json($certificate);
    }

    public function destroy(Certificate $certificate)
    {
        $certificate->delete();
        
        Cache::forget('certificates.index');

        return response()->json(null, 204);
    }
}
