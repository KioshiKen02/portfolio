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
        $user = User::factory()->create();
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
        $user = User::factory()->create();
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
}
