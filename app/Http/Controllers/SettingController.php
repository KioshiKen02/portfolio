<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();
        $flatSettings = [];
        foreach ($settings as $setting) {
            $flatSettings[$setting->key] = $setting->value;
        }
        return response()->json($flatSettings);
    }

    public function store(Request $request)
    {
        return $this->bulkUpdate($request);
    }

    public function update(Request $request, $id = null)
    {
        // If $id is provided, it's a single setting update
        if ($id) {
            $setting = Setting::findOrFail($id);
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

        // If no ID, it's a bulk update from the settings object
        return $this->bulkUpdate($request);
    }

    protected function bulkUpdate(Request $request)
    {
        $data = $request->all();
        
        foreach ($data as $key => $value) {
            // Determine type based on key or value if needed
            $type = 'text';
            if (str_contains($key, '_url') || str_contains($key, 'picture') || str_contains($key, 'logo')) {
                $type = 'url';
            } elseif (str_contains($key, 'description') || str_contains($key, 'paragraph')) {
                $type = 'textarea';
            } elseif (str_contains($key, 'email')) {
                $type = 'email';
            }

            // Determine group based on key
            $group = 'general';
            if (str_contains($key, 'hero')) {
                $group = 'hero';
            } elseif (str_contains($key, 'about')) {
                $group = 'about';
            } elseif (str_contains($key, 'contact') || str_contains($key, 'url') || str_contains($key, 'link')) {
                $group = 'social';
            } elseif (str_contains($key, 'picture') || str_contains($key, 'logo')) {
                $group = 'branding';
            }

            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'type' => $type,
                    'group' => $group
                ]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
