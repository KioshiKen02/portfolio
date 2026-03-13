<?php

namespace Tests\Feature;

use App\Models\TimelineAuditLog;
use App\Models\TimelineEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TimelineCrudTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function non_admin_cannot_manage_timeline_entries()
    {
        $user = User::factory()->create(['is_admin' => false]);
        $token = auth('api')->login($user);

        $res = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/timeline', [
                'title' => 'Role',
                'starts_at' => '2026-01-01 10:00:00',
                'responsibilities' => ['One'],
            ]);

        $res->assertStatus(403);
    }

    #[Test]
    public function admin_can_crud_timeline_entries_and_audit_is_recorded()
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = auth('api')->login($user);

        $create = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/timeline', [
                'title' => 'System Programmer',
                'organization' => 'Acme',
                'description' => 'Built internal systems.',
                'starts_at' => '2026-01-01 10:00:00',
                'ends_at' => '2026-02-01 10:00:00',
                'responsibilities' => ['A', 'B'],
                'media_url' => 'https://example.com/img.webp',
                'media_type' => 'image',
                'media_alt' => 'Preview',
                'sort_order' => 1,
            ]);

        $create->assertStatus(201);
        $id = $create->json('id');

        $this->assertDatabaseHas('timeline_entries', ['id' => $id, 'title' => 'System Programmer']);
        $this->assertDatabaseHas('timeline_audit_logs', ['timeline_entry_id' => $id, 'action' => 'created', 'user_id' => $user->id]);

        $update = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/admin/timeline/{$id}", [
                'title' => 'Senior System Programmer',
                'organization' => 'Acme',
                'description' => 'Updated.',
                'starts_at' => '2026-01-01 10:00:00',
                'ends_at' => '2026-02-01 10:00:00',
                'responsibilities' => ['A', 'B'],
                'sort_order' => 2,
            ]);

        $update->assertStatus(200)->assertJsonFragment(['title' => 'Senior System Programmer']);
        $this->assertDatabaseHas('timeline_audit_logs', ['timeline_entry_id' => $id, 'action' => 'updated', 'user_id' => $user->id]);

        $delete = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/admin/timeline/{$id}");

        $delete->assertStatus(204);
        $this->assertDatabaseMissing('timeline_entries', ['id' => $id]);
        $this->assertDatabaseHas('timeline_audit_logs', ['timeline_entry_id' => $id, 'action' => 'deleted', 'user_id' => $user->id]);

        $this->assertTrue(TimelineAuditLog::query()->where('timeline_entry_id', $id)->count() >= 3);
    }

    #[Test]
    public function public_timeline_endpoint_returns_entries()
    {
        TimelineEntry::create([
            'title' => 'Role A',
            'organization' => 'Org',
            'starts_at' => '2026-01-01 00:00:00',
            'responsibilities' => ['One'],
            'sort_order' => 0,
        ]);

        $res = $this->getJson('/api/timeline');
        $res->assertStatus(200)->assertJsonFragment(['title' => 'Role A']);
    }
}

