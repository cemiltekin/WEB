<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'message' => 'API configuration is missing. Copy api/config.example.php to api/config.php and update database credentials.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$config = require $configPath;
$sessionName = $config['app']['session_name'] ?? 'cemiltekin_portfolio_admin';
session_name($sessionName);
session_start();

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function db(): PDO
{
    static $pdo = null;
    global $config;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $db = $config['db'];
    $charset = $db['charset'] ?? 'utf8mb4';
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $db['host'], $db['name'], $charset);

    $pdo = new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function request_json(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function require_admin(): void
{
    if (empty($_SESSION['admin_user_id'])) {
        json_response(['ok' => false, 'message' => 'Unauthorized'], 401);
    }
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function require_csrf(array $data): void
{
    $token = $data['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!hash_equals(csrf_token(), (string) $token)) {
        json_response(['ok' => false, 'message' => 'Invalid CSRF token'], 403);
    }
}

function clean_string($value, int $maxLength): string
{
    $value = trim((string) $value);
    $length = function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
    if ($length > $maxLength) {
        $value = function_exists('mb_substr') ? mb_substr($value, 0, $maxLength) : substr($value, 0, $maxLength);
    }

    return $value;
}

function project_from_row(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'type' => $row['type'],
        'description' => $row['description'],
        'technologies' => array_values(array_filter(array_map('trim', explode(',', $row['technologies'])))),
        'github_url' => $row['github_url'],
        'is_featured' => (bool) $row['is_featured'],
        'is_visible' => (bool) $row['is_visible'],
        'sort_order' => (int) $row['sort_order'],
        'created_at' => $row['created_at'] ?? null,
        'updated_at' => $row['updated_at'] ?? null,
    ];
}
