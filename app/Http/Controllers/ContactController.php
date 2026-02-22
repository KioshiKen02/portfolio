<?php

namespace App\Http\Controllers;

use App\Mail\ContactReceived;
use App\Mail\ContactReplied;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    // Admin: List all contacts
    public function index(Request $request)
    {
        $query = Contact::query()->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $contacts = $query->paginate(15);

        return response()->json($contacts);
    }

    // Admin: Show a single contact
    public function show(Contact $contact)
    {
        if ($contact->status === 'new') {
            $contact->update([
                'status' => 'read',
                'read_at' => now(),
            ]);
        }

        return response()->json($contact);
    }

    // Guest: Store a new contact
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $contact = Contact::create(array_merge($validated, [
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]));

        // Notify Admin
        try {
            // In a real app, you'd queue this.
            // Using a hardcoded admin email for now or config
            $adminEmail = config('mail.from.address'); 
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new ContactReceived($contact));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send contact notification: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Thank you for reaching out.',
            'contact' => $contact,
        ], 201);
    }

    // Admin: Reply to a contact
    public function reply(Request $request, Contact $contact)
    {
        $request->validate([
            'reply_message' => 'required|string',
        ]);

        try {
            Mail::to($contact->email)->send(new ContactReplied($contact, $request->reply_message));

            $contact->update([
                'status' => 'replied',
                'replied_at' => now(),
            ]);

            return response()->json(['message' => 'Reply sent successfully.']);
        } catch (\Exception $e) {
            Log::error('Failed to send reply: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send reply.'], 500);
        }
    }

    // Admin: Delete a contact
    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Message deleted.']);
    }
}
