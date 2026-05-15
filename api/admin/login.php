<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_response([
        'ok' => true,
        'authenticated' => !empty($_SESSION['admin_user_id']),
        'csrf_token' => csrf_token(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Method not allowed'], 405);
}

$data = request_json();
$username = clean_string($data['username'] ?? '', 80);
$password = (string) ($data['password'] ?? '');

if ($username === '' || $password === '') {
    json_response(['ok' => false, 'message' => 'Kullanıcı adı ve şifre gerekli.'], 422);
}

$stmt = db()->prepare('SELECT * FROM admin_users WHERE username = :username LIMIT 1');
$stmt->execute([':username' => $username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    json_response(['ok' => false, 'message' => 'Giriş bilgileri hatalı.'], 401);
}

session_regenerate_id(true);
$_SESSION['admin_user_id'] = (int) $admin['id'];
$_SESSION['admin_username'] = $admin['username'];
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

json_response([
    'ok' => true,
    'message' => 'Giriş başarılı.',
    'csrf_token' => $_SESSION['csrf_token'],
]);
