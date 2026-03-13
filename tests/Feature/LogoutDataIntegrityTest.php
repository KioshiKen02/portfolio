<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class LogoutDataIntegrityTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_data_remains_intact_after_logout()
    {
        // 1. Create a user
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        // 2. Login
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $token = $response->json('access_token');

        // 3. Create a project (simulating user data)
        $projectData = [
            'title' => 'Test Project',
            'description' => 'Description',
            'type' => 'web',
            'technologies' => ['PHP', 'Vue'],
            'url' => 'http://example.com',
        ];

        $this->withHeader('Authorization', 'Bearer ' . $token)
             ->postJson('/api/admin/projects', $projectData)
             ->assertStatus(201); // Created

        // Verify project exists
        $this->assertDatabaseHas('projects', ['title' => 'Test Project']);

        // 4. Logout
        $this->withHeader('Authorization', 'Bearer ' . $token)
             ->postJson('/api/auth/logout')
             ->assertStatus(200);

        // 5. Verify data still exists in DB
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
        $this->assertDatabaseHas('projects', ['title' => 'Test Project']);

        // 6. Login again to verify access
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);
        
        $newToken = $response->json('access_token');
        
        // 7. Verify can fetch data
        $this->withHeader('Authorization', 'Bearer ' . $newToken)
             ->getJson('/api/projects')
             ->assertStatus(200)
             ->assertJsonFragment(['title' => 'Test Project']);
    }
}
