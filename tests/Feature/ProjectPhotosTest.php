<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProjectPhotosTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function admin_can_create_project_with_five_images()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $payload = [
            'title' => 'Gallery Project',
            'description' => 'Test project',
            'type' => 'web',
            'technologies' => ['Vue', 'Laravel'],
            'images' => [
                'https://example.com/1.webp',
                'https://example.com/2.webp',
                'https://example.com/3.webp',
                'https://example.com/4.webp',
                'https://example.com/5.webp',
            ],
            'image' => 'https://example.com/1.webp',
        ];

        $res = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/projects', $payload);

        $res->assertStatus(201)->assertJsonFragment(['title' => 'Gallery Project']);
        $this->assertDatabaseHas('projects', ['title' => 'Gallery Project']);
    }

    #[Test]
    public function project_images_require_minimum_five_when_provided()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $payload = [
            'title' => 'Too Few',
            'description' => 'Test',
            'type' => 'web',
            'images' => [
                'https://example.com/1.webp',
                'https://example.com/2.webp',
                'https://example.com/3.webp',
                'https://example.com/4.webp',
            ],
        ];

        $res = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/projects', $payload);

        $res->assertStatus(422);
    }
}

