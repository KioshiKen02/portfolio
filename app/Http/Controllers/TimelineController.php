<?php

namespace App\Http\Controllers;

use App\Models\TimelineAuditLog;
use App\Models\TimelineEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TimelineController extends Controller
{
    public function publicIndex()
    {
        return response()->json(
            Cache::remember('timeline.index', now()->addDay(), function () {
                return TimelineEntry::query()
                    ->orderBy('sort_order')
                    ->orderByDesc('starts_at')
                    ->get();
            })
        );
    }

    public function index()
    {
        return response()->json(
            TimelineEntry::query()
                ->orderBy('sort_order')
                ->orderByDesc('starts_at')
                ->get()
        );
    }

    public function audit()
    {
        return response()->json(
            TimelineAuditLog::query()
                ->with('user:id,name,email', 'entry:id,title')
                ->orderByDesc('created_at')
                ->limit(200)
                ->get()
        );
    }

    public function store(Request $request)
    {
        $data = $this->validateEntry($request);

        $entry = TimelineEntry::create($data);
        $this->log($request, 'created', null, $entry->toArray(), $entry->id);
        
        Cache::forget('timeline.index');

        return response()->json($entry, 201);
    }

    public function update(Request $request, TimelineEntry $timeline)
    {
        $before = $timeline->toArray();
        $data = $this->validateEntry($request);

        $timeline->update($data);
        $this->log($request, 'updated', $before, $timeline->toArray(), $timeline->id);
        
        Cache::forget('timeline.index');

        return response()->json($timeline);
    }

    public function destroy(Request $request, TimelineEntry $timeline)
    {
        $before = $timeline->toArray();
        $id = $timeline->id;
        $timeline->delete();

        $this->log($request, 'deleted', $before, null, $id);
        
        Cache::forget('timeline.index');

        return response()->json(null, 204);
    }

    protected function validateEntry(Request $request): array
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'organization' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'responsibilities' => 'nullable|array',
            'responsibilities.*' => 'required|string|max:500',
            'media_url' => 'nullable|string|max:2000',
            'media_type' => 'nullable|string|max:64',
            'media_alt' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0|max:100000',
        ]);

        if (isset($data['responsibilities']) && is_array($data['responsibilities'])) {
            $data['responsibilities'] = array_values(array_filter($data['responsibilities'], fn ($v) => is_string($v) && trim($v) !== ''));
        }

        return $data;
    }

    protected function log(Request $request, string $action, ?array $before, ?array $after, ?int $entryId): void
    {
        $user = $request->user('api');
        TimelineAuditLog::create([
            'timeline_entry_id' => $entryId,
            'action' => $action,
            'before' => $before,
            'after' => $after,
            'user_id' => $user?->id,
        ]);
    }
}

