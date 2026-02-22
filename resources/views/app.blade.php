<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Melvin Rey C Tambis – System Programmer</title>
    <meta name="description" content="Portfolio of Melvin Rey C Tambis, System Programmer and Computer Engineering graduate specializing in PHP Laravel backends, Vue.js frontends, and Flutter mobile applications with Laravel APIs.">
    <meta name="keywords" content="Melvin Rey C Tambis,System Programmer,PHP,Laravel,Vue.js,Flutter,Computer Engineering,Tagbilaran,Bohol">
    <meta name="author" content="Melvin Rey C Tambis">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    <script>
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
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => 'Melvin Rey C Tambis',
            'url' => config('app.url'),
            'jobTitle' => 'System Programmer',
            'email' => 'mailto:official.melvinreytambis@gmail.com',
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
                'https://github.com/KioshiKen02',
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
