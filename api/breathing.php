<?php
// Allow any website to call this API
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log the request
$timestamp = date('Y-m-d H:i:s');
$logMessage = "[$timestamp] Breathing video request received\n";
file_put_contents('breathing_log.txt', $logMessage, FILE_APPEND);

// Check if this is a video request
if (isset($_GET['video'])) {
    $videoPath = '../src/assets/breathing.mov';
    
    if (file_exists($videoPath)) {
        // Set proper headers for video streaming
        header('Content-Type: video/quicktime');
        header('Content-Length: ' . filesize($videoPath));
        header('Accept-Ranges: bytes');
        header('Cache-Control: no-cache');
        
        // Stream the video file
        readfile($videoPath);
        exit;
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Breathing video not found',
            'timestamp' => $timestamp,
            'server_info' => [
                'php_version' => PHP_VERSION,
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
            ]
        ]);
    }
    exit;
}

// Regular JSON response
$videoPath = '../src/assets/breathing.mov';

if (file_exists($videoPath)) {
    echo json_encode([
        'success' => true,
        'videoUrl' => '/api/breathing.php?video=1',
        'timestamp' => $timestamp,
        'server_info' => [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
        ],
        'debug' => [
            'requested_video' => 'breathing.mov',
            'file_exists' => true,
            'file_size' => filesize($videoPath)
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Breathing video not found',
        'timestamp' => $timestamp,
        'server_info' => [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
        ],
        'debug' => [
            'requested_video' => 'breathing.mov',
            'file_exists' => false,
            'file_path' => $videoPath
        ]
    ]);
}
?> 