<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::orderByDesc('created_at')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'type' => 'required|in:web,mobile,other',
            'technologies' => 'nullable|array',
        ]);

        $project = Project::create($validated);

        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return $project;
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'image' => 'nullable|string',
            'url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'type' => 'in:web,mobile,other',
            'technologies' => 'nullable|array',
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'folder' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            // Determine disk based on environment
            $disk = env('FILESYSTEM_DISK', 'public');

            $folder = $request->input('folder', 'projects');
            if (!in_array($folder, ['projects', 'profile'], true)) {
                $folder = 'projects';
            }
            
            // Store the file
            $path = $request->file('image')->store($folder, $disk);
            
            // Get the URL
            $url = \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
            
            // Fix for Supabase: Ensure URL is clean
            // Sometimes Storage::url() returns a double-slash or missing protocol depending on config
            if ($disk === 'supabase' && !str_starts_with($url, 'http')) {
                 $url = env('SUPABASE_URL') . '/' . $path;
            }

            return response()->json(['url' => $url]);
        }

        return response()->json(['message' => 'Upload failed'], 400);
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json(null, 204);
    }
}
