<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

try {
    $stmt = db()->query(
        'SELECT * FROM projects WHERE is_visible = 1 ORDER BY sort_order ASC, created_at DESC'
    );
    $projects = array_map('project_from_row', $stmt->fetchAll());

    json_response([
        'ok' => true,
        'featured' => array_values(array_filter($projects, fn (array $project) => $project['is_featured'])),
        'repositories' => $projects,
    ]);
} catch (Throwable $error) {
    json_response(['ok' => false, 'message' => 'Projects could not be loaded.'], 500);
}
