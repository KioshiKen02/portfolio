<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all());
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.type' => 'nullable|string',
            'settings.*.group' => 'nullable|string',
        ]);

        foreach ($data['settings'] as $item) {
            Setting::updateOrCreate(
                ['key' => $item['key']],
                [
                    'value' => $item['value'],
                    'type' => $item['type'] ?? 'text',
                    'group' => $item['group'] ?? 'general'
                ]
            );
        }
        
        // Optional: Remove keys that are not in the request? 
        // For now, let's keep it additive/update-only to be safe.
        // Or if we want full sync, we would delete others. 
        // Given the UI allows removing fields, we probably should delete missing keys if we want true sync.
        // But let's stick to updateOrCreate for safety unless specified.
        // Wait, if I remove a field in UI, it won't be sent. So it won't be deleted.
        // To support deletion, I should probably delete keys not present in the request.
        
        $keys = collect($data['settings'])->pluck('key');
        Setting::whereNotIn('key', $keys)->delete();

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
