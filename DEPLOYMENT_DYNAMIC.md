# Dynamic Portfolio Deployment Guide

This package converts the portfolio from static HTML/CSS/JS to a PHP + MySQL powered site.

## 1. Create the MySQL Database

In cPanel:

1. Open **MySQL Database Wizard**.
2. Create a database.
3. Create a database user.
4. Assign the user to the database with all privileges.

## 2. Import Tables and Seed Data

In phpMyAdmin:

1. Select the created database.
2. Import `database/schema.sql`.
3. Import `database/seed.sql`.

## 3. Configure API Credentials

1. Copy `api/config.example.php`.
2. Rename the copy to `api/config.php`.
3. Fill in the database credentials:

```php
'db' => [
    'host' => 'localhost',
    'name' => 'your_database_name',
    'user' => 'your_database_user',
    'pass' => 'your_database_password',
    'charset' => 'utf8mb4',
],
```

## 4. Create the Admin User

Generate a password hash on a PHP-enabled system:

```bash
php -r "echo password_hash('YOUR_STRONG_PASSWORD', PASSWORD_DEFAULT);"
```

Then run this SQL in phpMyAdmin:

```sql
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', 'PASTE_GENERATED_HASH_HERE');
```

## 5. Upload Files

Upload the contents of `cemiltekin_com_dynamic_deploy.zip` into `public_html`.

The admin panel will be available at:

```text
https://cemiltekin.com/admin/login.html
```

The public site will load projects from:

```text
https://cemiltekin.com/api/projects.php
```

## 6. Verify

- Open `https://cemiltekin.com`.
- Confirm the Projects section loads.
- Open `https://cemiltekin.com/admin/login.html`.
- Log in and edit one project.
- Submit a test message from the contact form.
- Confirm the message appears in the admin panel.
