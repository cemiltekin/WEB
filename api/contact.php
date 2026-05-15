<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Method not allowed'], 405);
}

$data = request_json();
$name = clean_string($data['name'] ?? '', 120);
$email = clean_string($data['email'] ?? '', 160);
$phone = clean_string($data['phone'] ?? '', 60);
$subject = clean_string($data['subject'] ?? '', 180);
$message = clean_string($data['message'] ?? '', 5000);

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    json_response(['ok' => false, 'message' => 'Lütfen zorunlu alanları doldurun.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'message' => 'Geçerli bir e-posta adresi girin.'], 422);
}

try {
    $stmt = db()->prepare(
        'INSERT INTO messages (name, email, phone, subject, message) VALUES (:name, :email, :phone, :subject, :message)'
    );
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone !== '' ? $phone : null,
        ':subject' => $subject,
        ':message' => $message,
    ]);

    global $config;
    $to = $config['mail']['to'] ?? '';
    if ($to !== '') {
        $body = "Yeni portföy mesajı\n\nAd: {$name}\nE-posta: {$email}\nTelefon: {$phone}\nKonu: {$subject}\n\nMesaj:\n{$message}\n";
        $headers = [
            'From: ' . ($config['mail']['from'] ?? 'no-reply@cemiltekin.com'),
            'Reply-To: ' . $email,
            'Content-Type: text/plain; charset=UTF-8',
        ];
        @mail($to, 'Portföy Sitesi Üzerinden Yeni Mesaj: ' . $subject, $body, implode("\r\n", $headers));
    }

    json_response(['ok' => true, 'message' => 'Mesajınız başarıyla gönderildi.']);
} catch (Throwable $error) {
    json_response(['ok' => false, 'message' => 'Mesaj kaydedilemedi. Lütfen daha sonra tekrar deneyin.'], 500);
}
