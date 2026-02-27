<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    @php
        $settings = $settings ?? [];
    @endphp

    <title>{{ $settings['site_title'] ?? 'Melvin Rey C Tambis – System Programmer' }}</title>
    <meta name="description" content="{{ $settings['site_description'] ?? 'Portfolio of Melvin Rey C Tambis, System Programmer and Computer Engineering graduate specializing in PHP Laravel backends, Vue.js frontends, and Flutter mobile applications with Laravel APIs.' }}">
    <meta name="keywords" content="{{ $settings['site_keywords'] ?? 'Melvin Rey C Tambis,System Programmer,PHP,Laravel,Vue.js,Flutter,Computer Engineering,Tagbilaran,Bohol' }}">
    <meta name="author" content="{{ $settings['site_author'] ?? 'Melvin Rey C Tambis' }}">
    <link rel="icon" type="image/svg+xml" href="{{ $settings['site_logo'] ?? '/logo.svg' }}">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    <script>
        window.AppConfig = {
            settings: @json($settings ?? [])
        };
        (function () {
            try {
                var theme = localStorage.getItem('theme');
                var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                if (theme === 'dark' || (!theme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {
            }
        })();
    </script>

    @php
        $siteTitle = $settings['site_title'] ?? 'Melvin Rey C Tambis';
        $siteDescription = $settings['site_description'] ?? 'System Programmer';
        $siteEmail = $settings['contact_email'] ?? 'official.melvinreytambis@gmail.com';
        $githubUrl = $settings['github_url'] ?? 'https://github.com/KioshiKen02';

        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => $siteTitle,
            'url' => config('app.url'),
            'jobTitle' => $siteDescription,
            'email' => 'mailto:' . $siteEmail,
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => 'Tagbilaran',
                'addressRegion' => 'Bohol',
                'addressCountry' => 'PH',
            ],
            'knowsAbout' => [
                'PHP',
                'Laravel',
                'Vue.js',
                'Tailwind CSS',
                'Flutter',
                'Dart',
                'REST APIs',
                'JWT Authentication',
            ],
            'sameAs' => [
                $githubUrl,
            ],
        ];
    @endphp

    <script type="application/ld+json">
        {!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
<div id="app"></div>
</body>
</html>
