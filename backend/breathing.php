<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Path to your breathing video file
$videoPath = '../public/assets/breathing-exercise.mp4';

if (file_exists($videoPath)) {
    $response = [
        'success' => true,
        'videoUrl' => '/assets/breathing-exercise.mp4'
    ];
} else {
    $response = [
        'success' => false,
        'error' => 'Video file not found'
    ];
}

echo json_encode($response); 