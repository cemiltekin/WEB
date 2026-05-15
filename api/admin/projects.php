<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';
require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = db()->query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
    json_response([
        'ok' => true,
        'csrf_token' => csrf_token(),
        'projects' => array_map('project_from_row', $stmt->fetchAll()),
    ]);
}

$data = request_json();
require_csrf($data);

if ($method === 'POST') {
    $stmt = db()->prepare(
        'INSERT INTO projects (title, type, description, technologies, github_url, is_featured, is_visible, sort_order)
         VALUES (:title, :type, :description, :technologies, :github_url, :is_featured, :is_visible, :sort_order)'
    );
    $stmt->execute(project_payload($data));
    json_response(['ok' => true, 'message' => 'Proje eklendi.']);
}

if ($method === 'PUT') {
    $id = (int) ($data['id'] ?? 0);
    if ($id < 1) {
        json_response(['ok' => false, 'message' => 'Geçerli proje id gerekli.'], 422);
    }

    $payload = project_payload($data);
    $payload[':id'] = $id;
    $stmt = db()->prepare(
        'UPDATE projects
         SET title = :title, type = :type, description = :description, technologies = :technologies,
             github_url = :github_url, is_featured = :is_featured, is_visible = :is_visible, sort_order = :sort_order
         WHERE id = :id'
    );
    $stmt->execute($payload);
    json_response(['ok' => true, 'message' => 'Proje güncellendi.']);
}

if ($method === 'DELETE') {
    $id = (int) ($data['id'] ?? 0);
    if ($id < 1) {
        json_response(['ok' => false, 'message' => 'Geçerli proje id gerekli.'], 422);
    }

    $stmt = db()->prepare('DELETE FROM projects WHERE id = :id');
    $stmt->execute([':id' => $id]);
    json_response(['ok' => true, 'message' => 'Proje silindi.']);
}

json_response(['ok' => false, 'message' => 'Method not allowed'], 405);

function project_payload(array $data): array
{
    $title = clean_string($data['title'] ?? '', 160);
    $type = clean_string($data['type'] ?? '', 120);
    $description = clean_string($data['description'] ?? '', 5000);
    $technologies = clean_string($data['technologies'] ?? '', 1000);
    $githubUrl = clean_string($data['github_url'] ?? '', 255);

    if ($title === '' || $type === '' || $description === '' || $technologies === '' || $githubUrl === '') {
        json_response(['ok' => false, 'message' => 'Tüm proje alanları zorunludur.'], 422);
    }

    if (!filter_var($githubUrl, FILTER_VALIDATE_URL)) {
        json_response(['ok' => false, 'message' => 'Geçerli GitHub URL girin.'], 422);
    }

    return [
        ':title' => $title,
        ':type' => $type,
        ':description' => $description,
        ':technologies' => $technologies,
        ':github_url' => $githubUrl,
        ':is_featured' => !empty($data['is_featured']) ? 1 : 0,
        ':is_visible' => !empty($data['is_visible']) ? 1 : 0,
        ':sort_order' => (int) ($data['sort_order'] ?? 0),
    ];
}
