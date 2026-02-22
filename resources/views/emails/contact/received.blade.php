<x-mail::message>
# New Message Received

You have received a new message from **{{ $contact->name }}** ({{ $contact->email }}).

**Subject:** {{ $contact->subject }}

**Message:**
<x-mail::panel>
{{ $contact->message }}
</x-mail::panel>

<x-mail::button :url="config('app.url') . '/admin'">
View in Admin Panel
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
