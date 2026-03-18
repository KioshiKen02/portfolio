<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProjectController extends Controller
{
    public function index()
    {
        return Cache::remember('projects.index', now()->addDay(), function () {
            return Project::orderByDesc('created_at')->get();
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'images' => 'nullable|array|min:5|max:20',
            'images.*' => 'required|string',
            'url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'type' => 'required|in:web,mobile,other',
            'technologies' => 'nullable|array',
        ]);

        $project = Project::create($validated);
        
        Cache::forget('projects.index');

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
            'images' => 'nullable|array|min:5|max:20',
            'images.*' => 'required|string',
            'url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'type' => 'in:web,mobile,other',
            'technologies' => 'nullable|array',
        ]);

        $project->update($validated);
        
        Cache::forget('projects.index');

        return response()->json($project);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'folder' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            // Determine disk based on environment
            $disk = env('FILESYSTEM_DISK', 'supabase');

            $folder = $request->input('folder', 'projects');
            if (!in_array($folder, ['projects', 'profile', 'timeline', 'certificates'], true)) {
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

    public function signUpload(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'folder' => 'nullable|string',
            'content_type' => 'required|string',
        ]);

        $disk = env('FILESYSTEM_DISK', 'public');
        
        // If we are using local/public disk, we can't do direct uploads easily without a separate controller
        // So we fallback to the standard upload for local dev
        if ($disk === 'public' || $disk === 'local') {
            return response()->json(['strategy' => 'server']);
        }

        $folder = $request->input('folder', 'projects');
        if (!in_array($folder, ['projects', 'profile', 'timeline', 'certificates'], true)) {
            $folder = 'projects';
        }

        // Generate a unique filename
        $extension = pathinfo($request->filename, PATHINFO_EXTENSION);
        $path = $folder . '/' . \Illuminate\Support\Str::random(40) . '.' . $extension;

        // Generate Presigned URL
        // Expiry: 5 minutes
        $client = \Illuminate\Support\Facades\Storage::disk($disk)->getClient();
        $command = $client->getCommand('PutObject', [
            'Bucket' => config("filesystems.disks.{$disk}.bucket"),
            'Key' => $path,
            'ContentType' => $request->input('content_type'),
            'ACL' => 'public-read', // Ensure it's public
        ]);

        $request = $client->createPresignedRequest($command, '+5 minutes');
        $signedUrl = (string) $request->getUri();

        // Calculate the final public URL
        $publicUrl = \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
        if ($disk === 'supabase' && !str_starts_with($publicUrl, 'http')) {
             $publicUrl = env('SUPABASE_URL') . '/' . $path;
        }

        return response()->json([
            'strategy' => 's3_presigned',
            'upload_url' => $signedUrl,
            'public_url' => $publicUrl,
            'method' => 'PUT',
            'headers' => [
                'Content-Type' => $request->getHeader('Content-Type')[0] ?? $request->input('content_type'),
            ]
        ]);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        
        Cache::forget('projects.index');

        return response()->json(null, 204);
    }
}
