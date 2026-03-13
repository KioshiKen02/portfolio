<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminUploadTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function upload_requires_authentication()
    {
        $response = $this->postJson('/api/admin/upload', []);
        $response->assertStatus(401);
    }

    #[Test]
    public function admin_can_upload_profile_image()
    {
        Storage::fake('public');

        $user = User::factory()->create(['is_admin' => true]);
        $token = auth('api')->login($user);

        $file = UploadedFile::fake()->image('avatar.png', 512, 512);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/upload', [
                'image' => $file,
                'folder' => 'profile',
            ]);

        $response->assertStatus(200)->assertJsonStructure(['url']);

        $files = Storage::disk('public')->allFiles('profile');
        $this->assertNotEmpty($files);
    }
}
