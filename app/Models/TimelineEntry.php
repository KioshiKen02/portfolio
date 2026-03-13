<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimelineEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'organization',
        'description',
        'starts_at',
        'ends_at',
        'responsibilities',
        'media_url',
        'media_type',
        'media_alt',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'responsibilities' => 'array',
        ];
    }
}

