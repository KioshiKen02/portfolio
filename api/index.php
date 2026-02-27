<?php

// 1. Force error reporting at the absolute start
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');

// 2. Diagnostic check for the vendor folder
$vendorPath = __DIR__ . '/../vendor/autoload.php';

if (!file_exists($vendorPath)) {
    http_response_code(500);
    echo "<h1>Critical Error: Vendor Folder Missing</h1>";
    echo "<p>The <code>vendor</code> directory was not found. This means <code>composer install</code> failed or did not run.</p>";
    echo "<p><strong>Current Directory:</strong> " . htmlspecialchars(__DIR__) . "</p>";
    echo "<h2>Root Directory Listing:</h2><pre>";
    print_r(scandir(__DIR__ . '/..'));
    echo "</pre>";
    exit;
}

require __DIR__ . '/../public/index.php';
