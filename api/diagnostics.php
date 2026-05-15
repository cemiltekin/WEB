<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

try {
    $pdo = db();
    $tables = [];
    foreach (['projects', 'messages', 'admin_users'] as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) AS total FROM {$table}");
        $tables[$table] = (int) $stmt->fetch()['total'];
    }

    json_response([
        'ok' => true,
        'php_version' => PHP_VERSION,
        'tables' => $tables,
    ]);
} catch (Throwable $error) {
    json_response([
        'ok' => false,
        'message' => 'Database diagnostics failed.',
        'error' => $error->getMessage(),
        'php_version' => PHP_VERSION,
    ], 500);
}
