<x-mail::message>
# Hello {{ $contact->name }},

Thank you for contacting me.

<x-mail::panel>
{{ $replyMessage }}
</x-mail::panel>

Best regards,<br>
{{ config('app.name') }}
</x-mail::message>
