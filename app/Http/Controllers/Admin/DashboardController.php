<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Contact;
use App\Models\TimelineEntry;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'projects' => Project::count(),
            'skills' => Skill::count(),
            'contacts' => Contact::count(),
            'timeline' => TimelineEntry::count(),
        ]);
    }
}
