<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class SettingTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function admin_can_view_settings()
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = auth('api')->login($user);

        Setting::create(['key' => 'site_title', 'value' => 'My Portfolio']);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->getJson('/api/admin/settings');

        $response->assertStatus(200)
                 ->assertJsonFragment(['key' => 'site_title', 'value' => 'My Portfolio']);
    }

    #[Test]
    public function admin_can_update_settings()
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = auth('api')->login($user);

        Setting::create(['key' => 'site_title', 'value' => 'Old Title']);

        $payload = [
            'settings' => [
                ['key' => 'site_title', 'value' => 'New Title', 'type' => 'text'],
                ['key' => 'new_key', 'value' => 'New Value', 'type' => 'text'],
            ]
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/admin/settings', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('settings', ['key' => 'site_title', 'value' => 'New Title']);
        $this->assertDatabaseHas('settings', ['key' => 'new_key', 'value' => 'New Value']);
    }

    #[Test]
    public function admin_can_save_profile_picture_urls()
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = auth('api')->login($user);

        $payload = [
            'settings' => [
                ['key' => 'profile_picture_light_default', 'value' => 'https://example.com/light.webp', 'type' => 'url', 'group' => 'profile'],
                ['key' => 'profile_picture_light_hover', 'value' => 'https://example.com/light-hover.webp', 'type' => 'url', 'group' => 'profile'],
                ['key' => 'profile_picture_dark_default', 'value' => 'https://example.com/dark.webp', 'type' => 'url', 'group' => 'profile'],
                ['key' => 'profile_picture_dark_hover', 'value' => 'https://example.com/dark-hover.webp', 'type' => 'url', 'group' => 'profile'],
            ]
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/admin/settings', $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', ['key' => 'profile_picture_dark_hover', 'value' => 'https://example.com/dark-hover.webp']);
    }

    #[Test]
    public function url_settings_reject_invalid_values()
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = auth('api')->login($user);

        $payload = [
            'settings' => [
                ['key' => 'profile_picture_light_default', 'value' => 'not-a-url', 'type' => 'url', 'group' => 'profile'],
            ]
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/admin/settings', $payload);

        $response->assertStatus(422);
    }
}
