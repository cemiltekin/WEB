<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 200');
    json_response([
        'ok' => true,
        'csrf_token' => csrf_token(),
        'messages' => $stmt->fetchAll(),
    ]);
}

$data = request_json();
require_csrf($data);

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = (int) ($data['id'] ?? 0);
    if ($id < 1) {
        json_response(['ok' => false, 'message' => 'Geçerli mesaj id gerekli.'], 422);
    }

    $stmt = db()->prepare('UPDATE messages SET is_read = :is_read WHERE id = :id');
    $stmt->execute([
        ':id' => $id,
        ':is_read' => !empty($data['is_read']) ? 1 : 0,
    ]);
    json_response(['ok' => true, 'message' => 'Mesaj güncellendi.']);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = (int) ($data['id'] ?? 0);
    if ($id < 1) {
        json_response(['ok' => false, 'message' => 'Geçerli mesaj id gerekli.'], 422);
    }

    $stmt = db()->prepare('DELETE FROM messages WHERE id = :id');
    $stmt->execute([':id' => $id]);
    json_response(['ok' => true, 'message' => 'Mesaj silindi.']);
}

json_response(['ok' => false, 'message' => 'Method not allowed'], 405);
