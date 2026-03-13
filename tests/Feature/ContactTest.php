<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_submit_contact_form()
    {
        Mail::fake();

        $response = $this->postJson('/api/contact', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Hello',
            'message' => 'This is a test message.',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('contacts', [
            'email' => 'john@example.com',
            'status' => 'new',
        ]);
    }

    public function test_admin_can_view_messages()
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($user);

        Contact::factory()->count(3)->create();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->getJson('/api/admin/contacts');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page']);
    }

    public function test_admin_can_reply_to_message()
    {
        Mail::fake();

        $user = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($user);

        $contact = Contact::factory()->create();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson("/api/admin/contacts/{$contact->id}/reply", [
                'reply_message' => 'Thank you for your message.',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'status' => 'replied',
        ]);
    }
}
