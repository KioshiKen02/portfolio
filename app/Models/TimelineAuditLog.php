<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimelineAuditLog extends Model
{
    protected $fillable = [
        'timeline_entry_id',
        'action',
        'before',
        'after',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'before' => 'array',
            'after' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function entry()
    {
        return $this->belongsTo(TimelineEntry::class, 'timeline_entry_id');
    }
}
