<?php
/**
 * FARMILY contact form handler.
 * Upload this file to the same directory as index.html on Hostinger.
 * The site's /contact page POSTs form data here as multipart/form-data.
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Honeypot: bots fill hidden fields, real visitors never see this one.
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

function clean_field($value) {
    return trim(strip_tags((string) ($value ?? '')));
}

$name = clean_field($_POST['name'] ?? '');
$company = clean_field($_POST['company'] ?? '');
$email = clean_field($_POST['email'] ?? '');
$message = clean_field($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Please fill in your name, email, and message.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

$to = 'benjamin.omayebu@farmilytechnologies.com';
$subject = 'New FARMILY contact form submission from ' . $name;

$body = "Name: {$name}\n";
$body .= 'Company: ' . ($company !== '' ? $company : '-') . "\n";
$body .= "Email: {$email}\n\n";
$body .= "Message:\n{$message}\n";

// NOTE: change the From address below to a real mailbox on your Hostinger
// domain (e.g. no-reply@farmilytechnologies.com) once that mailbox exists —
// mail servers are more likely to deliver (rather than spam-filter) messages
// whose From address matches the sending domain.
$headers = [
    'From: FARMILY Website <no-reply@farmilytechnologies.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Something went wrong sending your message. Please email us directly.']);
}
