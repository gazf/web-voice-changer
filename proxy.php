<?php

// for heroku.
$ALLOW_ORIGIN = getenv("ALLOW_ORIGIN");
$VOICE_TEXT_API_ACCESS_KEY = getenv("VOICE_TEXT_API_ACCESS_KEY");

$post_args = array(
    "text" => $_GET['text'],
    "speaker" => $_GET['speaker'],
    "format" => $_GET['format'],
    "emotion" => $_GET['emotion'],
    "emotion_level" => $_GET['emotion_level'],
);

$options = array(
    CURLOPT_URL => "https://api.voicetext.jp/v1/tts",
    CURLOPT_USERPWD => $VOICE_TEXT_API_ACCESS_KEY . ":",
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_HEADER => array(
        "Content-Type: application/x-www-form-urlencoded",
    ),
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_POSTFIELDS => http_build_query($post_args),
    CURLOPT_HEADER => false
);

$curl = curl_init();
curl_setopt_array($curl, $options);

header("Access-Control-Allow-Origin: " . $ALLOW_ORIGIN);
header("Accept-Ranges: bytes\n");
header("Content-Type: audio/ogg\n");
header("Connection: close\n");
header("\n");

curl_exec($curl);
curl_close($curl);
