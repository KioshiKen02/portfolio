<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SkillController extends Controller
{
    public function index()
    {
        return Cache::remember('skills.index', now()->addDay(), function () {
            return Skill::orderByDesc('proficiency')->get();
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'proficiency' => 'required|integer|min:0|max:100',
            'icon' => 'nullable|string',
            'category' => 'required|string|max:255',
        ]);

        $skill = Skill::create($validated);
        
        Cache::forget('skills.index');

        return response()->json($skill, 201);
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'proficiency' => 'integer|min:0|max:100',
            'icon' => 'nullable|string',
            'category' => 'string|max:255',
        ]);

        $skill->update($validated);
        
        Cache::forget('skills.index');

        return response()->json($skill);
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        
        Cache::forget('skills.index');

        return response()->json(null, 204);
    }
}
