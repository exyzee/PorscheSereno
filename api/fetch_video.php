<?php
// Let any website call this api
header('Access-Control-Allow-Origin: *');

// Get the type of traffic video user want
$type = isset($_GET['type']) ? $_GET['type'] : 'rain';

//  traffic videos 
$videoPaths = [
    'rain' => '../src/assets/widget-bg.mp4',    // Using widget-bg as rain traffic
    'sunny' => '../src/assets/widget-bg.mp4',   // Using same video for demo
    'snow' => '../src/assets/widget-bg.mp4'     // Using same video for demo
];

// If they want JSON info, send that
if (isset($_GET['info'])) {
    header('Content-Type: application/json');
    $timestamp = date('Y-m-d H:i:s');
    
    if (isset($videoPaths[$type]) && file_exists($videoPaths[$type])) {
        echo json_encode([
            'success' => true,
            'videoUrl' => "/api/fetch_video.php?type=$type",
            'timestamp' => $timestamp,
            'server' => 'PHP',
            'type' => $type
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Video not found',
            'timestamp' => $timestamp,
            'server' => 'PHP'
        ]);
    }
    exit;
}

// Otherwise, serve the video file
if (isset($videoPaths[$type]) && file_exists($videoPaths[$type])) {
    $file = $videoPaths[$type];
    $mime = mime_content_type($file);
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . filesize($file));
    readfile($file);
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Video not found']);
}
?> 