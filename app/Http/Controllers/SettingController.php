<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all());
    }

    public function store(Request $request)
    {
        return $this->syncSettings($request);
    }

    public function update(Request $request, Setting $setting)
    {
        $data = $request->validate([
            'value' => 'nullable|string',
            'type' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        $setting->update([
            'value' => $data['value'] ?? $setting->value,
            'type' => $data['type'] ?? $setting->type,
            'group' => $data['group'] ?? $setting->group,
        ]);

        return response()->json($setting);
    }

    protected function syncSettings(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.type' => 'nullable|string',
            'settings.*.group' => 'nullable|string',
        ]);

        foreach ($data['settings'] as $item) {
            $type = $item['type'] ?? 'text';
            $value = $item['value'] ?? null;

            if ($type === 'url' && $value !== null && $value !== '') {
                $isAbsolute = filter_var($value, FILTER_VALIDATE_URL) !== false;
                $isRelative = is_string($value) && str_starts_with($value, '/');
                if (!$isAbsolute && !$isRelative) {
                    throw ValidationException::withMessages([
                        'settings' => ['One or more URL settings are invalid.'],
                    ]);
                }
            }

            Setting::updateOrCreate(
                ['key' => $item['key']],
                [
                    'value' => $item['value'],
                    'type' => $type,
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
