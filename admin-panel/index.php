<?php
// TOWAN 作品管理頁 — 單檔應用
// 部署：整個資料夾改名成你的秘密路徑，放到網站根目錄旁（見 README-部署說明.md）
// ============================================================

const COOKIE_NAME  = 'towan_auth';
const COOKIE_DAYS  = 180;
const BACKUP_KEEP  = 20;
const MAX_UPLOAD_MB = 30;
const ALLOWED_EXT  = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

$SITE_ROOT   = dirname(__DIR__);                 // 管理頁資料夾放在網站根目錄內
$DATA_FILE   = $SITE_ROOT . '/data/works.json';
$ABOUT_FILE    = $SITE_ROOT . '/data/about.json';
$CONTACT_FILE  = $SITE_ROOT . '/data/contact.json';
$SETTINGS_FILE = $SITE_ROOT . '/data/settings.json';
$COVERS_DIR  = $SITE_ROOT . '/media/projects';      // 封面圖
$INNER_BASE  = $SITE_ROOT . '/media/projects';       // 作品內頁圖（每作品一個資料夾）
$PRIVATE_DIR = __DIR__ . '/_private';            // 金鑰與備份（.htaccess 禁止外部讀取）
$BACKUP_DIR  = $PRIVATE_DIR . '/backups';

const DEFAULT_SETTINGS = ['work' => [
    'title_size_desktop' => 32, 'title_size_mobile' => 26,
    'subtitle_size' => 14, 'services_size' => 12,
    'head_pad_top' => 96, 'head_pad_bottom' => 32,
    'hero_aspect' => 7, 'hero_overlay_y' => 0,
    'content_gap' => 80, 'content_width' => 850,
]];

// ---------- 基礎工具 ----------

function ensure_private_dirs(): void {
    global $PRIVATE_DIR, $BACKUP_DIR;
    if (!is_dir($BACKUP_DIR)) mkdir($BACKUP_DIR, 0755, true);
    $ht = $PRIVATE_DIR . '/.htaccess';
    if (!file_exists($ht)) file_put_contents($ht, "Require all denied\n");
}

function secret_key(): string {
    global $PRIVATE_DIR;
    ensure_private_dirs();
    $f = $PRIVATE_DIR . '/secret.key';
    if (!file_exists($f)) {
        file_put_contents($f, bin2hex(random_bytes(32)), LOCK_EX);
        @chmod($f, 0600);
    }
    return trim((string)file_get_contents($f));
}

// 通關密語存在 _private/passphrase.txt（不進版控）。第一次執行會自動產生
// 一組隨機密語，部署後請打開這個檔案改成自己好記的密語。
function passphrase(): string {
    global $PRIVATE_DIR;
    ensure_private_dirs();
    $f = $PRIVATE_DIR . '/passphrase.txt';
    if (!file_exists($f)) {
        file_put_contents($f, bin2hex(random_bytes(8)), LOCK_EX);
        @chmod($f, 0600);
    }
    return trim((string)file_get_contents($f));
}

function auth_token(): string {
    return hash_hmac('sha256', 'towan-admin-v1', secret_key());
}

function is_authed(): bool {
    return isset($_COOKIE[COOKIE_NAME]) && hash_equals(auth_token(), (string)$_COOKIE[COOKIE_NAME]);
}

function set_auth_cookie(): void {
    setcookie(COOKIE_NAME, auth_token(), [
        'expires'  => time() + COOKIE_DAYS * 86400,
        'path'     => '/',
        'secure'   => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function json_out(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $msg, int $code = 400): void {
    json_out(['ok' => false, 'error' => $msg], $code);
}

function read_works(): array {
    global $DATA_FILE;
    if (!file_exists($DATA_FILE)) return [];
    $arr = json_decode((string)file_get_contents($DATA_FILE), true);
    return is_array($arr) ? $arr : [];
}

function backup_works(): void {
    global $DATA_FILE, $BACKUP_DIR;
    ensure_private_dirs();
    if (!file_exists($DATA_FILE)) return;
    $stamp = date('Ymd-His');
    $target = $BACKUP_DIR . '/works-' . $stamp . '.json';
    $i = 1;
    while (file_exists($target)) {
        $target = $BACKUP_DIR . '/works-' . $stamp . '-' . $i++ . '.json';
    }
    copy($DATA_FILE, $target);
    $files = glob($BACKUP_DIR . '/works-*.json') ?: [];
    sort($files);
    while (count($files) > BACKUP_KEEP) {
        unlink(array_shift($files));
    }
}

function write_works(array $works): void {
    global $DATA_FILE;
    $dir = dirname($DATA_FILE);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $tmp = $DATA_FILE . '.tmp';
    $json = json_encode(array_values($works), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) fail('資料編碼失敗');
    if (file_put_contents($tmp, $json, LOCK_EX) === false) fail('寫入失敗，請檢查主機權限', 500);
    rename($tmp, $DATA_FILE);
}

function read_json_file(string $file, $default) {
    if (!file_exists($file)) return $default;
    $arr = json_decode((string)file_get_contents($file), true);
    return is_array($arr) ? $arr : $default;
}

function backup_json_file(string $file, string $prefix): void {
    global $BACKUP_DIR;
    ensure_private_dirs();
    if (!file_exists($file)) return;
    $stamp = date('Ymd-His');
    $target = $BACKUP_DIR . '/' . $prefix . '-' . $stamp . '.json';
    $i = 1;
    while (file_exists($target)) {
        $target = $BACKUP_DIR . '/' . $prefix . '-' . $stamp . '-' . $i++ . '.json';
    }
    copy($file, $target);
    $files = glob($BACKUP_DIR . '/' . $prefix . '-*.json') ?: [];
    sort($files);
    while (count($files) > BACKUP_KEEP) {
        unlink(array_shift($files));
    }
}

function write_json_file(string $file, array $data): void {
    $dir = dirname($file);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $tmp = $file . '.tmp';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) fail('資料編碼失敗');
    if (file_put_contents($tmp, $json, LOCK_EX) === false) fail('寫入失敗，請檢查主機權限', 500);
    rename($tmp, $file);
}

function sanitize_blocks($raw): array {
    if (!is_array($raw)) fail('資料格式錯誤');
    $out = [];
    foreach ($raw as $b) {
        if (!is_array($b)) continue;
        $type = in_array($b['type'] ?? '', ['h1', 'h2', 'p'], true) ? $b['type'] : 'p';
        $text = trim((string)($b['text'] ?? ''));
        if ($text === '') continue;
        $entry = [
            'type' => $type,
            'text' => $text,
            'size' => max(8, min(96, (int)($b['size'] ?? 14))),
            'mb'   => max(0, min(200, (int)($b['mb'] ?? 0))),
        ];
        if ($type === 'p') {
            $entry['leading'] = max(1, min(3, (float)($b['leading'] ?? 2.0)));
        }
        $out[] = $entry;
    }
    return $out;
}

function sanitize_settings($raw): array {
    $w = is_array($raw['work'] ?? null) ? $raw['work'] : [];
    $clamp = fn($v, $min, $max, $def) => is_numeric($v) ? max($min, min($max, (float)$v)) : $def;
    return ['work' => [
        'title_size_desktop' => $clamp($w['title_size_desktop'] ?? null, 12, 96, 32),
        'title_size_mobile'  => $clamp($w['title_size_mobile'] ?? null, 12, 96, 26),
        'subtitle_size'      => $clamp($w['subtitle_size'] ?? null, 8, 48, 14),
        'services_size'      => $clamp($w['services_size'] ?? null, 8, 48, 12),
        'head_pad_top'       => $clamp($w['head_pad_top'] ?? null, 0, 400, 96),
        'head_pad_bottom'    => $clamp($w['head_pad_bottom'] ?? null, 0, 200, 32),
        'hero_aspect'        => $clamp($w['hero_aspect'] ?? null, 1, 20, 7),
        'hero_overlay_y'     => $clamp($w['hero_overlay_y'] ?? null, -200, 200, 0),
        'content_gap'        => $clamp($w['content_gap'] ?? null, 0, 300, 80),
        'content_width'      => $clamp($w['content_width'] ?? null, 300, 1600, 850),
    ]];
}

function slugify(string $s): string {
    $s = strtolower(trim($s));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    $s = trim($s, '-');
    return $s !== '' ? substr($s, 0, 40) : '';
}

function safe_segment(string $s): string {
    // 資料夾／檔名防護：去掉路徑符號
    $s = str_replace(["\0", '/', '\\', '..'], '', $s);
    return trim($s);
}

// ---------- API ----------

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $body = [];
    if (($_SERVER['CONTENT_TYPE'] ?? '') && str_contains($_SERVER['CONTENT_TYPE'], 'application/json')) {
        $body = json_decode((string)file_get_contents('php://input'), true) ?: [];
        $action = $body['action'] ?? $action;
    }

    if ($action === 'login') {
        $pass = (string)($body['pass'] ?? $_POST['pass'] ?? '');
        usleep(random_int(200000, 500000)); // 減緩暴力嘗試
        if (!hash_equals(passphrase(), $pass)) fail('密語不正確', 401);
        set_auth_cookie();
        json_out(['ok' => true]);
    }

    if (!is_authed()) fail('未登入', 401);

    switch ($action) {
        case 'logout':
            setcookie(COOKIE_NAME, '', ['expires' => time() - 3600, 'path' => '/']);
            json_out(['ok' => true]);

        case 'status':
            global $DATA_FILE, $ABOUT_FILE, $CONTACT_FILE, $SETTINGS_FILE, $BACKUP_DIR;
            ensure_private_dirs();
            $works = read_works();
            $backups = array_map('basename', glob($BACKUP_DIR . '/works-*.json') ?: []);
            rsort($backups);
            json_out([
                'ok' => true,
                'works' => $works,
                'about' => read_json_file($ABOUT_FILE, ['blocks' => []]),
                'contact' => read_json_file($CONTACT_FILE, ['blocks' => []]),
                'settings' => sanitize_settings(read_json_file($SETTINGS_FILE, DEFAULT_SETTINGS)),
                'updatedAt' => file_exists($DATA_FILE) ? date('Y/m/d H:i', filemtime($DATA_FILE)) : '—',
                'backups' => $backups,
                'uploadLimit' => min(
                    (int)ini_get('upload_max_filesize'),
                    (int)ini_get('post_max_size'),
                    MAX_UPLOAD_MB
                ) . ' MB',
            ]);

        case 'about_save':
            global $ABOUT_FILE;
            $blocks = sanitize_blocks($body['blocks'] ?? null);
            backup_json_file($ABOUT_FILE, 'about');
            write_json_file($ABOUT_FILE, ['blocks' => $blocks]);
            json_out(['ok' => true, 'blocks' => $blocks]);

        case 'contact_save':
            global $CONTACT_FILE;
            $blocks = sanitize_blocks($body['blocks'] ?? null);
            backup_json_file($CONTACT_FILE, 'contact');
            write_json_file($CONTACT_FILE, ['blocks' => $blocks]);
            json_out(['ok' => true, 'blocks' => $blocks]);

        case 'settings_save':
            global $SETTINGS_FILE;
            $settings = sanitize_settings(is_array($body['settings'] ?? null) ? $body['settings'] : []);
            backup_json_file($SETTINGS_FILE, 'settings');
            write_json_file($SETTINGS_FILE, $settings);
            json_out(['ok' => true, 'settings' => $settings]);

        case 'save':
            $works = $body['works'] ?? null;
            if (!is_array($works)) fail('資料格式錯誤');
            foreach ($works as $w) {
                if (!is_array($w) || trim((string)($w['title'] ?? '')) === '') fail('每筆作品都需要標題');
            }
            $ids = [];
            foreach ($works as &$w) {
                $id = trim((string)($w['id'] ?? ''));
                if ($id === '' || in_array($id, $ids, true)) fail('作品編號重複或缺漏，請重新整理頁面再試');
                $ids[] = $id;
                $rawDims = is_array($w['inner_dims'] ?? null) ? $w['inner_dims'] : [];
                $w = [
                    'id'           => $id,
                    'title'        => trim((string)($w['title'] ?? '')),
                    'subtitle'     => trim((string)($w['subtitle'] ?? '')),
                    'category'     => trim((string)($w['category'] ?? '')),
                    'services'     => array_values(array_filter(array_map(
                        fn($x) => trim((string)$x),
                        is_array($w['services'] ?? null) ? $w['services'] : []
                    ), fn($x) => $x !== '')),
                    'image'        => trim((string)($w['image'] ?? '')),
                    'link'         => trim((string)($w['link'] ?? '')),
                    'inner_folder' => safe_segment((string)($w['inner_folder'] ?? '')),
                    'inner_images' => array_values(array_filter(array_map(
                        fn($x) => safe_segment((string)$x),
                        is_array($w['inner_images'] ?? null) ? $w['inner_images'] : []
                    ), fn($x) => $x !== '')),
                    'hero_bg'      => safe_segment((string)($w['hero_bg'] ?? '')),
                    'hero_overlay'   => safe_segment((string)($w['hero_overlay'] ?? '')),
                    'hero_overlay_w' => max(10, min(100, (int)($w['hero_overlay_w'] ?? 45))),
                    'description'  => trim((string)($w['description'] ?? '')),
                ];
                // 只保留仍被引用的圖檔尺寸（寬高皆為正整數才收）
                $dims = [];
                $referenced = $w['inner_images'];
                if ($w['hero_overlay'] !== '') $referenced[] = $w['hero_overlay'];
                foreach ($referenced as $f) {
                    $d = $rawDims[$f] ?? null;
                    if (is_array($d) && count($d) === 2 && (int)$d[0] > 0 && (int)$d[1] > 0) {
                        $dims[$f] = [(int)$d[0], (int)$d[1]];
                    }
                }
                if ($dims) $w['inner_dims'] = $dims;
            }
            unset($w);
            backup_works();
            write_works($works);
            json_out(['ok' => true, 'updatedAt' => date('Y/m/d H:i')]);

        case 'upload':
            global $COVERS_DIR, $INNER_BASE;
            if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
                fail('上傳失敗（檔案可能超過主機限制 ' . ini_get('upload_max_filesize') . '）');
            }
            $f = $_FILES['file'];
            if ($f['size'] > MAX_UPLOAD_MB * 1048576) fail('檔案超過 ' . MAX_UPLOAD_MB . 'MB 限制');

            $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
            if ($ext === 'jpeg') $ext = 'jpg';
            if (!in_array($ext, ALLOWED_EXT, true)) fail('只接受 JPG／PNG／GIF／WEBP 圖片');
            $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
            if (!in_array($mime, ALLOWED_MIME, true)) fail('檔案內容不是圖片');

            $kind = $_POST['kind'] ?? '';
            $base = pathinfo($f['name'], PATHINFO_FILENAME);
            $name = slugify($base) ?: 'img';

            if ($kind === 'cover') {
                if (!is_dir($COVERS_DIR)) mkdir($COVERS_DIR, 0755, true);
                $file = 'cover-' . $name . '-' . date('His') . '.' . $ext;
                if (!move_uploaded_file($f['tmp_name'], $COVERS_DIR . '/' . $file)) fail('存檔失敗', 500);
                json_out(['ok' => true, 'path' => '/media/projects/' . $file]);
            }

            if ($kind === 'inner') {
                $folder = safe_segment((string)($_POST['folder'] ?? ''));
                if ($folder === '') fail('缺少作品資料夾名稱');
                $dir = $INNER_BASE . '/' . $folder;
                if (!is_dir($dir)) mkdir($dir, 0755, true);
                $file = $name . '.' . $ext;
                $i = 1;
                while (file_exists($dir . '/' . $file)) {
                    $file = $name . '-' . $i++ . '.' . $ext;
                }
                if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $file)) fail('存檔失敗', 500);
                $size = @getimagesize($dir . '/' . $file);
                json_out([
                    'ok' => true, 'filename' => $file, 'folder' => $folder,
                    'w' => $size ? (int)$size[0] : 0, 'h' => $size ? (int)$size[1] : 0,
                ]);
            }
            fail('未知的上傳類型');

        case 'restore':
            global $BACKUP_DIR;
            $name = basename((string)($body['backup'] ?? ''));
            if (!preg_match('/^works-\d{8}-\d{6}(-\d+)?\.json$/', $name)) fail('備份名稱不正確');
            $src = $BACKUP_DIR . '/' . $name;
            if (!file_exists($src)) fail('找不到這份備份');
            backup_works();
            $arr = json_decode((string)file_get_contents($src), true);
            if (!is_array($arr)) fail('備份檔損毀');
            write_works($arr);
            json_out(['ok' => true]);

        default:
            fail('未知的操作');
    }
}

$authed = is_authed();
?><!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>TOWAN 作品管理</title>
<style>
  :root {
    --accent:#e5004e; --accent-press:#ff1f66; --accent-line:#d22d4b; --text:#1d1d1f; --muted:#86868b;
    --danger:#ff3b30;
    --glass:rgba(255,255,255,.58); --glass-soft:rgba(255,255,255,.42);
    --glass-edge:rgba(255,255,255,.75); --line:rgba(0,0,0,.09);
    --field:rgba(255,255,255,.72);
    --shadow:0 10px 34px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.05);
    --shadow-hover:0 14px 38px rgba(0,0,0,.14), 0 0 0 1px color-mix(in srgb, var(--accent) 14%, transparent);
    --glass-inset:inset 0 1px 0 rgba(255,255,255,.55);
    --ease:cubic-bezier(.16,1,.3,1);
    --topbar:rgba(255,255,255,.62);
    /* 液態玻璃粉（同首頁 hero 玻璃質感） */
    --accent-glass:rgba(229,0,78,.55); --accent-glass-hover:rgba(229,0,78,.66);
    --accent-glass-border:rgba(255,255,255,.28);
    --accent-glass-shadow:inset 0 0 0 1px rgba(255,255,255,.14), inset 0 2px 20px rgba(255,255,255,.18), 0 3px 8px rgba(229,0,78,.16);
    /* 新擬物（neumorphism）柔和卡片 */
    --neu-bg:#eef0f3;
    --neu-light:rgba(255,255,255,.95); --neu-dark:rgba(163,171,183,.45);
    --neu-shadow:6px 6px 14px var(--neu-dark), -6px -6px 14px var(--neu-light);
    --neu-shadow-sm:3px 3px 8px var(--neu-dark), -3px -3px 8px var(--neu-light);
    --neu-inset:inset 3px 3px 7px var(--neu-dark), inset -3px -3px 7px var(--neu-light);
  }
  /* 固定白色玻璃介面（不跟隨系統深色模式） */
  * { box-sizing:border-box; }
  html, body { height:100%; }
  body { margin:0; color:var(--text);
         font:15px/1.7 -apple-system, BlinkMacSystemFont, "SF Pro TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
         -webkit-font-smoothing:antialiased; background:#f2f3f5; overflow:hidden; }
  body::before { content:''; position:fixed; inset:-20%; z-index:-1; pointer-events:none;
    background:
      radial-gradient(38% 34% at 84% 18%, rgba(229,0,78,.16), transparent 70%),
      radial-gradient(36% 34% at 16% 20%, rgba(210,45,75,.10), transparent 70%),
      radial-gradient(40% 38% at 66% 88%, rgba(160,160,175,.14), transparent 70%),
      radial-gradient(30% 30% at 8% 86%, rgba(190,190,205,.12), transparent 70%);
    filter:blur(52px); }

  h1 { font-size:18px; font-weight:700; letter-spacing:.14em; margin:0; }
  h2 { font-size:14px; font-weight:600; margin:0 0 14px; }

  input[type=text], input[type=password], textarea, select {
    width:100%; padding:10px 14px; border:1px solid var(--line); border-radius:12px;
    font:inherit; color:var(--text); background:var(--field);
    transition:box-shadow .2s var(--ease), border-color .2s var(--ease); outline:none; appearance:none; }
  input:focus, textarea:focus { border-color:var(--accent); box-shadow:0 0 0 3.5px color-mix(in srgb, var(--accent) 22%, transparent); }
  textarea { min-height:72px; resize:vertical; }
  label { display:block; font-size:12px; font-weight:500; color:var(--muted); margin:14px 0 5px; }
  button { font:inherit; font-weight:500; padding:9px 20px; border-radius:99px;
           background:var(--accent-glass); color:#fff; cursor:pointer; border:1px solid var(--accent-glass-border);
           backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%);
           box-shadow:var(--accent-glass-shadow);
           transition:transform .2s var(--ease), background .2s var(--ease), box-shadow .2s var(--ease), opacity .2s var(--ease); }
  button:hover { background:var(--accent-glass-hover); }
  button:active { transform:scale(.965); }
  button:focus { outline:none; }
  button:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
  button.ghost { background:var(--glass-soft); color:var(--text); border:1px solid var(--line); box-shadow:none;
                 backdrop-filter:blur(16px) saturate(180%); -webkit-backdrop-filter:blur(16px) saturate(180%); }
  button.ghost:hover { background:var(--glass); }
  button.danger { background:transparent; color:var(--danger); border:1px solid color-mix(in srgb, var(--danger) 35%, transparent); box-shadow:none; backdrop-filter:none; -webkit-backdrop-filter:none; }
  button.danger:hover { background:color-mix(in srgb, var(--danger) 10%, transparent); }
  button:disabled { opacity:.4; cursor:default; transform:none; }
  input[type=file] { font-size:13px; color:var(--muted); }
  input[type=file]::file-selector-button {
    font:inherit; font-size:13px; font-weight:500; margin-right:10px; padding:6px 14px;
    border:1px solid var(--line); border-radius:99px; background:var(--glass-soft); color:var(--text); cursor:pointer; }
  .row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .grid2 { display:grid; grid-template-columns:2fr 1fr; gap:12px; }
  .hint { font-size:12px; color:var(--muted); }
  a.hint { text-decoration:none; }

  /* ---------- 三欄外框 ---------- */
  .app { display:grid; grid-template-rows:auto 1fr; height:100vh; }
  .topbar { display:flex; align-items:center; gap:18px; padding:12px 22px;
            background:var(--topbar); backdrop-filter:blur(40px) saturate(180%); -webkit-backdrop-filter:blur(40px) saturate(180%);
            border-bottom:1px solid var(--glass-edge); box-shadow:var(--shadow), var(--glass-inset); z-index:5; }
  .topbar .brand { display:flex; align-items:center; gap:10px; }
  .topbar .brand img { height:20px; width:auto; display:block; }
  .topbar .brand span { font-size:12px; color:var(--muted); letter-spacing:.1em; }
  .topbar .stats { display:flex; gap:20px; margin-left:6px; font-size:12px; color:var(--muted); }
  .topbar .stats b { color:var(--text); font-weight:700; font-size:14px; }
  .topbar .spacer { flex:1; }
  .topbar .row button { padding:6px 14px; font-size:13px; }

  .cols { display:grid; grid-template-columns:380px 1fr 340px; min-height:0; }
  .cols2 { display:grid; grid-template-columns:420px 1fr; min-height:0; }
  .panel { min-height:0; overflow-y:auto; padding:22px; }
  .panel.edit { border-right:1px solid var(--line); background:var(--neu-bg); }
  .panel.list { border-left:1px solid var(--line); }
  .panel.preview { padding:0; display:flex; flex-direction:column; background:rgba(127,127,127,.05); }
  .panel::-webkit-scrollbar { width:9px; }
  .panel::-webkit-scrollbar-thumb { background:rgba(127,127,127,.28); border-radius:99px; border:2px solid transparent; background-clip:content-box; }

  /* ---------- 圖片上傳格 ---------- */
  .panel.edit input[type=text], .panel.edit textarea { margin-top:8px; padding:8px 12px; font-size:14px; }
  .panel.edit .grid2 { gap:8px; }
  .panel.edit .grid2 input { margin-top:8px; }
  #fServices { min-height:56px; }
  #fDesc { min-height:44px; }
  /* 新擬物：欄位內凹，卡片外凸，同一底色靠雙向陰影塑形，邊框降到最低 */
  .panel.edit input[type=text], .panel.edit textarea, .panel.edit select {
    background:var(--neu-bg); border:1px solid transparent; box-shadow:var(--neu-inset); }
  .panel.edit input:focus, .panel.edit textarea:focus {
    box-shadow:var(--neu-inset), 0 0 0 3.5px color-mix(in srgb, var(--accent) 20%, transparent); }
  .slot { border:1px solid rgba(255,255,255,.6); border-radius:20px; padding:16px 18px; margin-top:18px;
          background:var(--neu-bg); box-shadow:var(--neu-shadow); transition:box-shadow .25s var(--ease); }
  .slot:hover { box-shadow:var(--neu-shadow), 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent); }
  .slot.drop-main { border-color:color-mix(in srgb, var(--accent) 40%, transparent);
                    box-shadow:var(--neu-inset), 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
  .slot .slot-h { display:flex; align-items:center; gap:9px; font-size:11px; font-weight:600;
                  letter-spacing:.06em; text-transform:uppercase; color:var(--muted); margin-bottom:12px; }
  .slot .slot-h .no { display:inline-flex; align-items:center; justify-content:center; width:19px; height:19px;
                      border-radius:50%; background:var(--accent-glass); border:1px solid var(--accent-glass-border);
                      backdrop-filter:blur(16px) saturate(180%); -webkit-backdrop-filter:blur(16px) saturate(180%);
                      box-shadow:var(--neu-shadow-sm); color:#fff; font-size:10.5px; font-weight:700; flex:none; }
  .slot .slot-h .tip { font-weight:400; text-transform:none; letter-spacing:0; }
  .slot-preview { width:100%; aspect-ratio:16/10; object-fit:cover; border-radius:10px;
                  background:rgba(127,127,127,.15); display:none; margin-bottom:8px; }

  /* ---------- 段落區塊編輯（About / Contact） ---------- */
  .blockrow { border:1px solid rgba(255,255,255,.6); border-radius:18px; padding:14px 16px; margin-top:14px;
              background:var(--neu-bg); box-shadow:var(--neu-shadow-sm); transition:box-shadow .25s var(--ease); }
  .blockrow:hover { box-shadow:var(--neu-shadow); }
  .blockrow .bh { display:flex; align-items:center; gap:6px; margin-bottom:8px; }
  .blockrow select { width:auto; flex:none; padding:5px 8px; font-size:12px; border-radius:10px; }
  .blockrow .bh .spacer { flex:1; }
  .blockrow .bh button { padding:3px 9px; font-size:12px; }
  .blockrow textarea { min-height:44px; font-size:13px; padding:8px 10px; margin-top:0; }
  .settings-card { border:1px solid rgba(255,255,255,.6); border-radius:18px; padding:16px 18px; margin-top:16px;
                   background:var(--neu-bg); box-shadow:var(--neu-shadow-sm); transition:box-shadow .25s var(--ease); }
  .settings-card:hover { box-shadow:var(--neu-shadow); }
  .settings-field + .settings-field { margin-top:16px; padding-top:16px; border-top:1px solid rgba(163,171,183,.28); }
  .settings-field label { margin:0 0 8px; transition:color .2s var(--ease); }
  .settings-field:hover label { color:var(--accent); }
  .range-row { display:flex; align-items:center; gap:12px; }
  .range-row input[type=number] { width:72px; flex:none; padding:6px 8px; text-align:center; font-size:13px;
                                   background:var(--neu-bg); border:1px solid transparent; box-shadow:var(--neu-inset); }
  .range-row input[type=number]:focus { box-shadow:var(--neu-inset), 0 0 0 3.5px color-mix(in srgb, var(--accent) 22%, transparent); }
  .range-row input[type=range] { flex:1; width:auto; -webkit-appearance:none; appearance:none;
    height:8px; border-radius:99px; background:var(--neu-bg); box-shadow:var(--neu-inset); outline:none; cursor:pointer; margin:0; padding:0; border:none; }
  .range-row input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%;
    background:var(--neu-bg); box-shadow:var(--neu-shadow-sm), inset 0 0 0 2px var(--accent);
    cursor:pointer; transition:transform .15s var(--ease); }
  .range-row input[type=range]::-webkit-slider-thumb:hover { transform:scale(1.1); }
  .range-row input[type=range]::-moz-range-track { background:transparent; border:none; }
  .range-row input[type=range]::-moz-range-thumb { width:18px; height:18px; border-radius:50%; border:none;
    background:var(--neu-bg); box-shadow:var(--neu-shadow-sm), inset 0 0 0 2px var(--accent); cursor:pointer; }
  .blockrow .bnums { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:10px; }
  .blockrow .bnums.two { grid-template-columns:1fr 1fr; }
  .blockrow .bnums label { margin:0 0 4px; font-size:10.5px; }
  .blockrow .bnums input { padding:6px 10px; font-size:13px; }
  .hero-tile { position:relative; width:100%; border-radius:14px; overflow:hidden; margin-top:10px;
               background:var(--neu-bg); box-shadow:var(--neu-inset); transition:box-shadow .2s var(--ease); }
  .hero-tile.over { box-shadow:var(--neu-inset), inset 0 0 0 3px var(--accent); }
  .hero-tile .tile-img { display:none; width:100%; height:auto; max-height:130px; object-fit:cover; }
  .hero-tile .tile-tag { position:absolute; left:8px; top:8px; z-index:2; font-size:11px; font-weight:600;
                         color:#fff; background:rgba(0,0,0,.5); padding:2px 10px; border-radius:99px;
                         backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); pointer-events:none; }
  .hero-tile .tile-x { display:none; position:absolute; right:8px; top:8px; z-index:2; width:24px; height:24px;
                       padding:0; border-radius:50%; font-size:12px; line-height:1;
                       background:rgba(255,255,255,.85); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
                       box-shadow:0 2px 8px rgba(0,0,0,.2); }
  .tile-add { display:flex; align-items:center; justify-content:center; width:100%; min-height:64px;
              background:transparent; color:var(--muted); font-size:26px; font-weight:300;
              border:none; border-radius:0; padding:0; }
  .tile-add:hover { background:color-mix(in srgb, var(--accent) 8%, transparent); color:var(--accent); }
  .add-tile { display:flex; align-items:center; justify-content:center; width:100%; margin-top:10px; padding:12px;
              border:1.5px dashed color-mix(in srgb, var(--muted) 35%, transparent); border-radius:14px; background:var(--neu-bg);
              color:var(--muted); font-size:22px; font-weight:300; line-height:1; box-shadow:var(--neu-shadow-sm); }
  .add-tile { transition:border-color .2s var(--ease), color .2s var(--ease), box-shadow .2s var(--ease); }
  .add-tile:hover { border-color:var(--accent); color:var(--accent); box-shadow:var(--neu-inset); }
  .ov-ctrl { display:none; align-items:center; gap:10px; margin-top:10px; }
  .ov-ctrl input[type=range] { flex:1; accent-color:var(--accent); }
  .thumb-acts { position:absolute; right:6px; top:50%; transform:translateY(-50%) translateX(4px);
                display:flex; align-items:center; gap:4px;
                opacity:0; transition:opacity .2s var(--ease), transform .2s var(--ease); pointer-events:none; }
  .thumb:hover .thumb-acts { opacity:1; transform:translateY(-50%); pointer-events:auto; }
  .thumb-acts button { position:static; width:auto; height:auto; white-space:nowrap;
                       padding:3px 10px; font-size:11px; font-weight:600; color:#1d1d1f;
                       background:rgba(255,255,255,.78); backdrop-filter:blur(16px) saturate(180%);
                       -webkit-backdrop-filter:blur(16px) saturate(180%);
                       box-shadow:0 1px 6px rgba(0,0,0,.18); border:none; border-radius:99px; }
  .thumb-acts button:hover { background:#fff; }
  .thumb-acts button.rm { color:var(--danger); padding:3px 8px; }
  .thumbs { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
  .thumb { position:relative; width:100%; border-radius:10px; overflow:hidden; }
  .thumb-handle { position:absolute; left:0; top:0; bottom:0; width:22px; z-index:3;
                  display:flex; align-items:center; justify-content:center;
                  background:linear-gradient(to right, rgba(0,0,0,.22), rgba(0,0,0,0));
                  color:rgba(255,255,255,.75); font-size:12px; cursor:grab; user-select:none;
                  transition:color .2s var(--ease); }
  .thumb-handle:hover { color:#fff; }
  .thumb-handle:active { cursor:grabbing; }
  .thumb-handle { touch-action:none; }
  .thumb.lifting { z-index:6; box-shadow:0 10px 28px rgba(0,0,0,.3); overflow:visible; }
  .thumb.lifting img { border-radius:10px; }
  .thumb img { width:100%; height:64px; object-fit:cover; border-radius:10px;
               background:rgba(127,127,127,.15); display:block; pointer-events:none; }
  .thumb.dragging { opacity:.35; }
  .thumb.over { outline:2px solid var(--accent); outline-offset:2px; border-radius:14px; }
  .thumb .ord { position:absolute; left:28px; bottom:5px; background:rgba(0,0,0,.55); color:#fff;
                font-size:10px; font-weight:600; padding:1px 8px; border-radius:99px; line-height:1.5; pointer-events:none; }

  /* ---------- 第二欄預覽 ---------- */
  .preview-bar { display:flex; align-items:center; gap:12px; padding:10px 16px; flex:none;
                 border-bottom:1px solid var(--line); background:var(--glass);
                 backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%); }
  .seg { display:inline-flex; background:var(--glass-soft); border:1px solid var(--line); border-radius:99px; padding:2px; }
  .seg button { background:transparent; color:var(--muted); padding:5px 14px; font-size:12.5px; border-radius:99px;
                border:none; box-shadow:none; backdrop-filter:none; -webkit-backdrop-filter:none;
                transition:background .2s var(--ease), color .2s var(--ease), box-shadow .2s var(--ease); }
  .seg button.active { background:var(--accent-glass); color:#fff; border:1px solid var(--accent-glass-border);
                        backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%);
                        box-shadow:var(--accent-glass-shadow); }
  .preview-stage { flex:1; min-height:0; overflow:auto; display:flex; justify-content:center; padding:22px; }
  .preview-frame-wrap { width:100%; max-width:100%; transition:max-width .3s var(--ease); }
  .preview-frame-wrap.mobile { max-width:390px; }
  #previewFrame, #aboutPreviewFrame, #contactPreviewFrame, #settingsPreviewFrame {
                  width:100%; height:100%; min-height:100%; border:none; border-radius:16px;
                  background:#fff; box-shadow:var(--shadow); display:block; }

  /* ---------- 第三欄清單 ---------- */
  .additem { display:flex; align-items:center; justify-content:center; gap:8px; padding:13px;
             border:1.5px dashed color-mix(in srgb, var(--accent) 45%, transparent); border-radius:14px; margin-bottom:12px;
             color:var(--accent); font-weight:600; font-size:13.5px; cursor:pointer; background:transparent; transition:background .2s var(--ease); }
  .additem:hover { background:color-mix(in srgb, var(--accent) 8%, transparent); }
  .additem.active { background:color-mix(in srgb, var(--accent) 14%, transparent); border-style:solid; }
  .savebar { position:sticky; bottom:-22px; z-index:4; display:flex; gap:8px; align-items:center;
             margin:18px -22px -22px; padding:14px 22px;
             background:var(--neu-bg); border-top:1px solid rgba(255,255,255,.7);
             box-shadow:0 -8px 18px -12px var(--neu-dark); }
  .item { position:relative; display:flex; gap:10px; align-items:center; padding:8px 10px 8px 26px;
          border:1px solid var(--glass-edge); border-radius:14px; margin-bottom:8px;
          background:var(--glass-soft); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          cursor:pointer; box-shadow:none; transition:background .2s var(--ease), box-shadow .2s var(--ease); }
  .item:hover { background:var(--glass); box-shadow:var(--shadow-hover); }
  .item.editing { border-color:var(--accent); box-shadow:0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent); }
  .item.lifting { z-index:6; box-shadow:0 10px 28px rgba(0,0,0,.25); }
  .item-handle { position:absolute; left:0; top:0; bottom:0; width:22px;
                 display:flex; align-items:center; justify-content:center;
                 color:var(--muted); font-size:11px; cursor:grab; user-select:none; touch-action:none;
                 opacity:.55; transition:opacity .2s var(--ease); }
  .item:hover .item-handle { opacity:1; }
  .item-handle:active { cursor:grabbing; }
  .item img { width:46px; height:35px; object-fit:cover; border-radius:8px; background:rgba(127,127,127,.15); flex:none; }
  .item .t { flex:1; min-width:0; }
  .item .t b { display:block; font-weight:600; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .item .t span { font-size:10px; letter-spacing:.1em; color:var(--muted); }
  .item .item-x { flex:none; padding:3px 9px; font-size:12px; opacity:0; transition:opacity .2s var(--ease); }
  .item:hover .item-x { opacity:1; }

  details { margin-top:16px; border-top:1px solid var(--line); padding-top:14px; }
  details summary { cursor:pointer; font-size:13px; font-weight:500; color:var(--muted); }
  .bk { display:flex; justify-content:space-between; align-items:center; padding:7px 0;
        border-bottom:1px solid var(--line); font-size:12.5px; }
  .bk:last-child { border-bottom:none; }

  .msg { position:fixed; left:50%; bottom:26px; transform:translateX(-50%);
         background:rgba(30,30,32,.72); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%);
         border:1px solid rgba(255,255,255,.16); color:#fff; padding:11px 22px; border-radius:99px;
         font-size:14px; opacity:0; transition:opacity .3s var(--ease); pointer-events:none; z-index:99; box-shadow:var(--shadow); }
  .msg.show { opacity:1; }

  /* ---------- 登入頁 ---------- */
  .card { background:var(--glass); backdrop-filter:blur(40px) saturate(180%); -webkit-backdrop-filter:blur(40px) saturate(180%);
          border:1px solid var(--glass-edge); border-radius:22px; padding:24px; box-shadow:var(--shadow), var(--glass-inset); }
  .login { max-width:380px; margin:16vh auto 0; text-align:center; padding:0 20px; }
  .login h1 { font-size:22px; }

  /* ---------- 窄螢幕：疊成單欄 ---------- */
  @media (max-width:1100px) {
    body { overflow:auto; }
    .app { height:auto; min-height:100vh; }
    .cols { grid-template-columns:1fr; }
    .cols2 { grid-template-columns:1fr; }
    .panel { overflow:visible; }
    .panel.edit { border-right:none; border-bottom:1px solid var(--line); }
    .panel.list { border-left:none; border-top:1px solid var(--line); }
    .panel.preview { height:80vh; }
  }
</style>
</head>
<body>

<?php if (!$authed): ?>
<div class="login">
  <h1>TOWAN</h1>
  <p class="hint" style="margin:8px 0 24px">作品管理入口</p>
  <div class="card" style="text-align:left">
    <label>通關密語</label>
    <input type="password" id="pass" autocomplete="current-password">
    <div style="margin-top:14px"><button id="loginBtn" style="width:100%">進入</button></div>
    <p class="hint" id="loginErr" style="margin:10px 0 0"></p>
  </div>
  <p class="hint">輸入一次後，這台裝置之後打開網址即可直接進入。</p>
</div>
<script>
  const btn = document.getElementById('loginBtn');
  const pass = document.getElementById('pass');
  async function doLogin() {
    btn.disabled = true;
    const r = await fetch(location.pathname, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ action:'login', pass: pass.value })
    }).then(r=>r.json()).catch(()=>({ok:false,error:'連線失敗'}));
    if (r.ok) location.reload();
    else { document.getElementById('loginErr').textContent = r.error || '密語不正確'; btn.disabled = false; }
  }
  btn.onclick = doLogin;
  pass.onkeydown = e => { if (e.key === 'Enter') doLogin(); };
  pass.focus();
</script>

<?php else: ?>
<div class="app">
  <header class="topbar">
    <div class="brand"><img id="brandLogo" alt="TOWAN"><span>網站管理</span></div>
    <div class="seg" id="pageTabs">
      <button data-tab="works" class="active">作品</button>
      <button data-tab="about">About</button>
      <button data-tab="contact">Contact</button>
      <button data-tab="settings">模板設定</button>
    </div>
    <div class="stats" id="worksStats">
      <span><b id="stCount">—</b> 作品</span>
      <span>更新 <b id="stUpdated" style="font-size:12.5px">—</b></span>
      <span><b id="stBackups">—</b> 備份</span>
    </div>
    <div class="spacer"></div>
    <div class="row">
      <a class="hint" href="/" target="_blank">查看網站 ↗</a>
      <button class="ghost" id="logoutBtn">登出</button>
    </div>
  </header>

  <div class="cols" id="tab-works">

    <!-- 第一欄：編輯表單 -->
    <section class="panel edit">
      <h2 id="editorTitle">新增作品</h2>
      <div class="grid2">
        <input type="text" id="fTitle" placeholder="標題">
        <div><input type="text" id="fCategory" list="catList" placeholder="分類"><datalist id="catList"></datalist></div>
      </div>
      <input type="text" id="fSubtitle" placeholder="中文副標">
      <textarea id="fServices" placeholder="PRODUCT DESIGN / 瓶身設計&#10;PACKAGE DESIGN / 包裝設計"></textarea>

      <div class="slot" id="mainSlot">
        <div class="slot-h"><span class="no">1</span> 主視覺</div>
        <div class="hero-tile" id="heroCompose">
          <span class="tile-tag">底圖</span>
          <img class="tile-img" id="mainPreview">
          <button class="tile-add" id="bgEmpty">＋</button>
          <button class="danger tile-x" id="rmBg" title="移除">✕</button>
          <input type="file" id="fMain" accept="image/*" hidden>
        </div>
        <div class="hero-tile" id="overlayDrop">
          <span class="tile-tag">文字</span>
          <img class="tile-img" id="overlayPreview">
          <button class="tile-add" id="ovEmpty">＋</button>
          <button class="danger tile-x" id="rmOverlay" title="移除">✕</button>
          <input type="file" id="fOverlay" accept="image/*" hidden>
        </div>
        <div class="ov-ctrl" id="ovCtrl">
          <input type="range" id="fOverlayW" min="10" max="100" value="45">
          <b id="ovWval" style="font-size:12px">45%</b>
        </div>
      </div>

      <div class="slot" id="worksSlot">
        <div class="slot-h"><span class="no">2</span> 作品集 <span class="tip">拖曳排序</span></div>
        <div class="thumbs" id="worksThumbs"></div>
        <button class="add-tile" id="addWorks">＋</button>
        <input type="file" id="fWorks" accept="image/*" multiple hidden>
      </div>

      <div class="slot">
        <div class="slot-h"><span class="no">3</span> 封面 <span class="tip">首頁縮圖</span></div>
        <div class="hero-tile" id="coverTile">
          <img class="tile-img" id="coverPreview">
          <button class="tile-add" id="coverEmpty">＋</button>
          <button class="danger tile-x" id="rmCover" title="移除">✕</button>
          <input type="file" id="fCover" accept="image/*" hidden>
        </div>
      </div>

      <textarea id="fDesc" placeholder="作品描述（顯示於首頁作品牆卡片，不會出現在作品內頁）"></textarea>

      <div class="savebar">
        <button id="saveWorkBtn" style="flex:1">儲存並發布</button>
        <button class="ghost" id="cancelEditBtn" style="display:none">取消</button>
      </div>
    </section>

    <!-- 第二欄：即時預覽 -->
    <section class="panel preview">
      <div class="preview-bar">
        <div class="seg" id="viewSeg">
          <button data-view="inner" class="active">內頁預覽</button>
          <button data-view="wall">作品牆縮圖</button>
        </div>
        <div class="spacer" style="flex:1"></div>
        <div class="seg" id="widthSeg">
          <button data-w="desktop" class="active">桌機</button>
          <button data-w="mobile">手機</button>
        </div>
      </div>
      <div class="preview-stage">
        <div class="preview-frame-wrap" id="frameWrap">
          <iframe id="previewFrame" title="預覽"></iframe>
        </div>
      </div>
    </section>

    <!-- 第三欄：作品集清單 -->
    <aside class="panel list">
      <h2>所有作品 <span style="font-weight:400;font-size:11px;color:var(--muted)">上＝優先</span></h2>
      <input type="text" id="listSearch" placeholder="搜尋" style="margin-bottom:10px">
      <div id="worksList"></div>
      <details>
        <summary>自動備份還原（最多 <?= BACKUP_KEEP ?> 份）</summary>
        <div id="backupList" style="margin-top:10px"></div>
        <p class="hint" style="margin:12px 0 0">單張圖片上限：<span id="stLimit">—</span>。出問題別緊張，先用備份還原。</p>
      </details>
    </aside>

  </div>

  <!-- About 分頁 -->
  <div class="cols2" id="tab-about" style="display:none">
    <section class="panel edit">
      <h2>About 內容</h2>
      <p class="hint" style="margin-bottom:10px">每一段可各自設定字級與下方間距，拖曳排序用上下箭頭。</p>
      <div id="aboutBlocks"></div>
      <button class="add-tile" id="aboutAddBlock" style="margin-top:10px">＋ 新增段落</button>
      <div class="savebar">
        <button id="aboutSaveBtn" style="flex:1">儲存並發布</button>
      </div>
    </section>
    <section class="panel preview">
      <div class="preview-bar">
        <div class="spacer" style="flex:1"></div>
        <div class="seg" id="aboutWidthSeg">
          <button data-w="desktop" class="active">桌機</button>
          <button data-w="mobile">手機</button>
        </div>
      </div>
      <div class="preview-stage">
        <div class="preview-frame-wrap" id="aboutFrameWrap">
          <iframe id="aboutPreviewFrame" title="預覽"></iframe>
        </div>
      </div>
    </section>
  </div>

  <!-- Contact 分頁 -->
  <div class="cols2" id="tab-contact" style="display:none">
    <section class="panel edit">
      <h2>Contact 內容</h2>
      <p class="hint" style="margin-bottom:10px">地圖固定不可編輯，僅文字段落可調整。</p>
      <div id="contactBlocks"></div>
      <button class="add-tile" id="contactAddBlock" style="margin-top:10px">＋ 新增段落</button>
      <div class="savebar">
        <button id="contactSaveBtn" style="flex:1">儲存並發布</button>
      </div>
    </section>
    <section class="panel preview">
      <div class="preview-bar">
        <div class="spacer" style="flex:1"></div>
        <div class="seg" id="contactWidthSeg">
          <button data-w="desktop" class="active">桌機</button>
          <button data-w="mobile">手機</button>
        </div>
      </div>
      <div class="preview-stage">
        <div class="preview-frame-wrap" id="contactFrameWrap">
          <iframe id="contactPreviewFrame" title="預覽"></iframe>
        </div>
      </div>
    </section>
  </div>

  <!-- 模板設定分頁：套用到全部作品內頁 -->
  <div class="cols2" id="tab-settings" style="display:none">
    <section class="panel edit">
      <h2>作品內頁模板設定</h2>
      <p class="hint" style="margin-bottom:10px">這裡的數字套用到「所有」作品的內頁，儲存後全站作品內頁排版立即統一更新。</p>

      <div class="settings-card">
        <div class="settings-field" data-hl="title">
          <label>標題字級 — 桌機 (px)</label>
          <div class="range-row" data-k="title_size_desktop">
            <input type="range" class="rng" min="12" max="96" step="1">
            <input type="number" class="rngval" min="12" max="96" step="1">
          </div>
        </div>
        <div class="settings-field" data-hl="title">
          <label>標題字級 — 手機 (px)</label>
          <div class="range-row" data-k="title_size_mobile">
            <input type="range" class="rng" min="12" max="96" step="1">
            <input type="number" class="rngval" min="12" max="96" step="1">
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-field" data-hl="subtitle">
          <label>副標字級 (px)</label>
          <div class="range-row" data-k="subtitle_size">
            <input type="range" class="rng" min="8" max="48" step="1">
            <input type="number" class="rngval" min="8" max="48" step="1">
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-field" data-hl="services">
          <label>內頁字句字級（VISUAL DESIGN / 主視覺設計⋯）(px)</label>
          <div class="range-row" data-k="services_size">
            <input type="range" class="rng" min="8" max="48" step="1">
            <input type="number" class="rngval" min="8" max="48" step="1">
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-field" data-hl="padTop">
          <label>標題區上間距 (px)</label>
          <div class="range-row" data-k="head_pad_top">
            <input type="range" class="rng" min="0" max="400" step="2">
            <input type="number" class="rngval" min="0" max="400" step="2">
          </div>
        </div>
        <div class="settings-field" data-hl="padBottom">
          <label>標題區下間距 (px)</label>
          <div class="range-row" data-k="head_pad_bottom">
            <input type="range" class="rng" min="0" max="200" step="2">
            <input type="number" class="rngval" min="0" max="200" step="2">
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-field" data-hl="hero">
          <label>Hero 圖高比例（寬 ÷ 高，數字越大越扁）</label>
          <div class="range-row" data-k="hero_aspect">
            <input type="range" class="rng" min="1" max="20" step="0.5">
            <input type="number" class="rngval" min="1" max="20" step="0.5">
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-field" data-hl="overlay">
          <label>Hero 疊字上下位置（px，負值往上）</label>
          <div class="range-row" data-k="hero_overlay_y">
            <input type="range" class="rng" min="-200" max="200" step="2">
            <input type="number" class="rngval" min="-200" max="200" step="2">
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-field" data-hl="gap">
          <label>作品圖垂直間距 (px)</label>
          <div class="range-row" data-k="content_gap">
            <input type="range" class="rng" min="0" max="300" step="2">
            <input type="number" class="rngval" min="0" max="300" step="2">
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-field" data-hl="width">
          <label>內容最大寬度 (px)</label>
          <div class="range-row" data-k="content_width">
            <input type="range" class="rng" min="300" max="1600" step="10">
            <input type="number" class="rngval" min="300" max="1600" step="10">
          </div>
        </div>
      </div>

      <div class="savebar">
        <button id="settingsSaveBtn" style="flex:1">儲存並套用到全部作品</button>
      </div>
    </section>
    <section class="panel preview">
      <div class="preview-bar">
        <span class="hint">預覽套用範例作品（實際文字以各作品內容為準）</span>
        <div class="spacer" style="flex:1"></div>
        <div class="seg" id="settingsWidthSeg">
          <button data-w="desktop" class="active">桌機</button>
          <button data-w="mobile">手機</button>
        </div>
      </div>
      <div class="preview-stage">
        <div class="preview-frame-wrap" id="settingsFrameWrap">
          <iframe id="settingsPreviewFrame" title="預覽"></iframe>
        </div>
      </div>
    </section>
  </div>

</div>

<div class="msg" id="msg"></div>

<script>
const $ = id => document.getElementById(id);

// 後台可能部署在子目錄(preview: /preview/<秘密夾>/)或正式根目錄(/<秘密夾>/)。
// 從自己的網址推出網站 base(去掉結尾的 index.php 與秘密資料夾那一段),
// 圖片預覽才能在兩種位置都正確指向 media/(否則 /preview/ 下會抓到根目錄而破圖)。
const SITE_BASE = location.pathname.replace(/index\.php$/, '').replace(/[^/]+\/$/, '');
$('brandLogo').src = SITE_BASE + 'images/towanlogo-BLK.png';

let works = [];
let editingIndex = -1;   // -1 = 新增模式
let draft = { image:'', inner_folder:'', main:'', works:[], overlay:'', overlayW:45, dims:{} };
let busy = false;
let previewReady = false;

const DEFAULT_TMPL = {
  title_size_desktop:32, title_size_mobile:26, subtitle_size:14, services_size:12,
  head_pad_top:96, head_pad_bottom:32, hero_aspect:7, hero_overlay_y:0,
  content_gap:80, content_width:850,
};
let templateSettings = { work: {...DEFAULT_TMPL} };
let settingsDraft = { ...DEFAULT_TMPL };
let aboutBlocks = [];
let contactBlocks = [];
let currentTab = 'works';

function toast(t, ms=2200) {
  const m = $('msg'); m.textContent = t; m.classList.add('show');
  clearTimeout(m._t); m._t = setTimeout(()=>m.classList.remove('show'), ms);
}

async function api(payload) {
  const r = await fetch(location.pathname, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  const d = await r.json().catch(()=>({ok:false,error:'伺服器回應異常'}));
  if (r.status === 401) { location.reload(); throw new Error('未登入'); }
  if (!d.ok) throw new Error(d.error || '發生錯誤');
  return d;
}

async function uploadFile(file, kind, folder='') {
  const fd = new FormData();
  fd.append('action','upload'); fd.append('kind',kind); fd.append('file',file);
  if (folder) fd.append('folder', folder);
  const r = await fetch(location.pathname, { method:'POST', body:fd });
  const d = await r.json().catch(()=>({ok:false,error:'上傳失敗'}));
  if (!d.ok) throw new Error(d.error || '上傳失敗');
  return d;
}

function imgUrl(p) {
  if (!p) return '';
  return p.startsWith('http') ? p : SITE_BASE + p.replace(/^\//,'') + '?v=' + Date.now();
}
function innerUrl(file) {
  if (!file || !draft.inner_folder) return '';
  return SITE_BASE + 'media/projects/' + encodeURIComponent(draft.inner_folder) + '/' + encodeURIComponent(file) + '?v=' + Date.now();
}
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ---- 統計 / 清單 ----

function renderStats(d) {
  $('stCount').textContent = works.length;
  if (d) {
    $('stUpdated').textContent = d.updatedAt;
    $('stBackups').textContent = d.backups.length;
    $('stLimit').textContent = d.uploadLimit;
    renderBackups(d.backups);
  }
  const cats = [...new Set(works.map(w=>w.category).filter(Boolean))];
  $('catList').innerHTML = cats.map(c=>`<option value="${esc(c)}">`).join('');
}

let listQuery = '';
function renderList() {
  const q = listQuery.trim().toLowerCase();
  const addCard = `<div class="additem ${editingIndex===-1?'active':''}" data-new="1">＋ 新增作品</div>`;
  $('worksList').innerHTML = addCard + works.map((w,i)=>{
    if (q && !((w.title||'').toLowerCase().includes(q) || (w.category||'').toLowerCase().includes(q))) return '';
    return `
    <div class="item ${i===editingIndex?'editing':''}" data-open="${i}">
      ${q ? '' : '<span class="item-handle" title="按住拖曳">⠿</span>'}
      <img src="${esc(imgUrl(w.image))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
      <div class="t"><b>${esc(w.title)}</b><span>${esc(w.category||'')}</span></div>
      <button class="danger item-x" data-del="${i}" title="刪除">✕</button>
    </div>`;
  }).join('');
}

function renderBackups(backups) {
  $('backupList').innerHTML = backups.length ? backups.map(b=>{
    const m = b.match(/works-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})/);
    const label = m ? `${m[1]}/${m[2]}/${m[3]} ${m[4]}:${m[5]}` : b;
    return `<div class="bk"><span>${label}</span><button class="ghost" data-restore="${esc(b)}" style="padding:4px 10px;font-size:12px">還原</button></div>`;
  }).join('') : '<p class="hint">還沒有備份，第一次儲存後就會出現。</p>';
}

// ---- 編輯器 ----

function renderMainPreview() {
  const setTile = (imgEl, emptyEl, xEl, file) => {
    if (file) { imgEl.src = innerUrl(file); imgEl.style.display='block'; emptyEl.style.display='none'; xEl.style.display='block'; }
    else { imgEl.style.display='none'; emptyEl.style.display='flex'; xEl.style.display='none'; }
  };
  setTile($('mainPreview'), $('bgEmpty'), $('rmBg'), draft.main);
  setTile($('overlayPreview'), $('ovEmpty'), $('rmOverlay'), draft.overlay);
  $('ovCtrl').style.display = draft.overlay ? 'flex' : 'none';
  $('fOverlayW').value = draft.overlayW;
  $('ovWval').textContent = draft.overlayW + '%';
  const cp = $('coverPreview');
  if (draft.image) { cp.src = imgUrl(draft.image); cp.style.display='block'; $('coverEmpty').style.display='none'; $('rmCover').style.display='block'; }
  else { cp.style.display='none'; $('coverEmpty').style.display='flex'; $('rmCover').style.display='none'; }
}
function renderWorksThumbs() {
  $('worksThumbs').innerHTML = draft.works.map((f,i)=>`
    <div class="thumb" data-idx="${i}">
      <span class="thumb-handle" title="按住拖曳">⠿</span>
      <img src="${innerUrl(f)}" loading="lazy" draggable="false">
      <span class="ord">${i+1}</span>
      <div class="thumb-acts">
        <button data-setbg="${i}">底圖</button>
        <button data-setov="${i}">文字</button>
        <button class="rm" data-rmwork="${i}">✕</button>
      </div>
    </div>`).join('');
}

function setAsBg(i) {
  const picked = draft.works[i], old = draft.main;
  draft.main = picked;
  if (old) draft.works[i] = old; else draft.works.splice(i, 1);
  renderMainPreview(); renderWorksThumbs(); updatePreview();
  toast('已設為底圖');
}
function setAsOverlay(i) {
  const picked = draft.works[i], old = draft.overlay;
  draft.overlay = picked;
  if (old) draft.works[i] = old; else draft.works.splice(i, 1);
  renderMainPreview(); renderWorksThumbs(); updatePreview();
  toast('已設為文字');
}

function resetEditor() {
  editingIndex = -1;
  draft = { image:'', inner_folder:'', main:'', works:[], overlay:'', overlayW:45, dims:{} };
  ['fTitle','fSubtitle','fCategory','fServices','fDesc'].forEach(id=>$(id).value='');
  $('fMain').value=''; $('fWorks').value=''; $('fCover').value=''; $('fOverlay').value='';
  $('editorTitle').textContent='新增作品';
  $('cancelEditBtn').style.display='none';
  renderMainPreview();
  renderWorksThumbs();
  renderList();
  updatePreview();
}

function loadEditor(i) {
  const w = works[i];
  editingIndex = i;
  draft = {
    image: w.image||'', inner_folder: w.inner_folder||'',
    main: w.hero_bg||'', works: [...(w.inner_images||[])],
    overlay: w.hero_overlay||'', overlayW: w.hero_overlay_w||45,
    dims: {...(w.inner_dims||{})},
  };
  $('fTitle').value=w.title||''; $('fSubtitle').value=w.subtitle||'';
  $('fCategory').value=w.category||''; $('fDesc').value=w.description||'';
  $('fServices').value=(w.services||[]).join('\n');
  $('editorTitle').textContent='編輯：' + (w.title||'');
  $('cancelEditBtn').style.display='inline-block';
  renderMainPreview();
  renderWorksThumbs();
  renderList();
  updatePreview();
  $('fTitle').scrollIntoView({behavior:'smooth', block:'nearest'});
}

function draftFolder() {
  if (draft.inner_folder) return draft.inner_folder;
  const slug = $('fTitle').value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
  draft.inner_folder = slug || ('work-' + Date.now());
  return draft.inner_folder;
}

function composeInnerImages() {
  return draft.works.filter(Boolean);
}

function rememberDims(d) {
  if (d.filename && d.w > 0 && d.h > 0) draft.dims[d.filename] = [d.w, d.h];
}

function composeInnerDims() {
  const out = {};
  [...composeInnerImages(), draft.main, draft.overlay].filter(Boolean).forEach(f => {
    if (draft.dims[f]) out[f] = draft.dims[f];
  });
  return out;
}

// ---- 第二欄預覽 ----

let previewView = 'inner';
let previewWidth = 'desktop';

function previewDoc() {
  return `<!doctype html><html><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>html,body{background:#fff;margin:0}body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro TC","PingFang TC","Microsoft JhengHei",sans-serif;color:#1d1d1f}img{display:block}
      .hl-bar{transition:opacity .18s ease}
      .hl-box{transition:box-shadow .18s ease;border-radius:8px;box-shadow:0 0 0 0 rgba(229,0,78,0)}
      .hl-box.on{box-shadow:0 0 0 3px #e5004e, 0 0 22px rgba(229,0,78,.28)}
      #pv-hero.on{outline:3px solid #e5004e;outline-offset:-3px}
      #pv-overlay.on{outline:3px solid #e5004e;outline-offset:2px}
      #pv-imgs.on{outline:2px dashed #e5004e;outline-offset:-2px}
    </style>
    </head><body><div id="root"></div>
    <script>
      const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      function renderInner(d){
        const t = d.tmpl||{};
        const titleD = t.title_size_desktop||32, titleM = t.title_size_mobile||26;
        const subtitleSize = t.subtitle_size||14;
        const servicesSize = t.services_size||12;
        const padTop = t.head_pad_top!=null?t.head_pad_top:64;
        const padBottom = t.head_pad_bottom!=null?t.head_pad_bottom:32;
        const heroAspect = t.hero_aspect||7;
        const overlayY = t.hero_overlay_y||0;
        const gap = t.content_gap!=null?t.content_gap:56;
        const width = t.content_width||820;
        const services = d.services||[];
        const imgs = d.images||[];
        const heroBg = d.heroBg||'';
        const ov = d.heroOverlay||'';
        const ovw = d.heroOverlayW||60;
        // 主視覺:滿版(iframe 全寬),裁成統一橫幅(比例可調),文字疊圖置中 —— 與 view.astro 一致
        const hero = heroBg ? \`<div style="position:relative;width:100%;font-size:0">
            <div id="pv-hero" style="width:100%;aspect-ratio:\${heroAspect}/1;overflow:hidden">
              <img src="\${heroBg}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:center;margin:0;padding:0" onerror="this.style.opacity=.15">
            </div>
            \${ov?\`<img id="pv-overlay" src="\${ov}" style="position:absolute;left:50%;top:50%;transform:translate(-50%,calc(-50% + \${overlayY}px));width:\${ovw}%;height:auto">\`:''}
          </div>\` : '';
        // 其餘作品照片:置中欄 + 每張之間有間隔(間距可調)
        const rest = imgs.map(u=>\`<img class="pv-img" src="\${u}" style="display:block;width:100%;height:auto;margin:0 0 \${gap}px 0" onerror="this.style.opacity=.15">\`).join('');
        const restWrap = rest ? \`<div id="pv-imgs" class="mx-auto px-5" style="max-width:\${width}px;padding-top:\${gap}px;padding-bottom:64px;font-size:0;position:relative">
            <div id="pv-gapBar" class="hl-bar" style="position:absolute;top:0;left:0;right:0;height:\${gap}px;background:rgba(229,0,78,.16);border-top:1px dashed #e5004e;border-bottom:1px dashed #e5004e;opacity:0;pointer-events:none"></div>
            \${rest}
          </div>\` : '';
        const empty = (!heroBg && !imgs.length) ? '<p class="text-center text-sm text-neutral-300 py-16">尚未上傳圖片</p>' : '';
        return \`<div style="background:#fff">
          <div id="pv-head" class="mx-auto text-center" style="max-width:800px;padding-top:\${padTop}px;padding-bottom:\${padBottom}px;position:relative">
            <div id="pv-padTop" class="hl-bar" style="position:absolute;top:0;left:0;right:0;height:\${padTop}px;background:rgba(229,0,78,.16);border-bottom:1px dashed #e5004e;opacity:0;pointer-events:none"></div>
            <div id="pv-padBottom" class="hl-bar" style="position:absolute;bottom:0;left:0;right:0;height:\${padBottom}px;background:rgba(229,0,78,.16);border-top:1px dashed #e5004e;opacity:0;pointer-events:none"></div>
            <span class="text-xs tracking-widest text-neutral-400 mb-8 inline-block">← WORKS</span>
            <h1 id="pv-title" class="hl-box text-[\${titleM}px] md:text-[\${titleD}px] font-bold tracking-wide uppercase text-neutral-900">\${esc(d.title)||'<span class=\\'text-neutral-300\\'>作品標題</span>'}</h1>
            \${d.subtitle?\`<p id="pv-subtitle" class="hl-box mt-3 tracking-wide text-neutral-400" style="font-size:\${subtitleSize}px">\${esc(d.subtitle)}</p>\`:''}
            \${services.length?\`<div id="pv-services" class="hl-box mt-8 space-y-1.5">\${services.map(s=>\`<p class="font-medium tracking-wide uppercase text-neutral-600" style="font-size:\${servicesSize}px">\${esc(s)}</p>\`).join('')}</div>\`:''}
          </div>
          \${hero}
          \${restWrap}
          \${empty}
        </div>\`;
      }
      function renderWall(d){
        const cover = d.cover;
        return \`<div class="min-h-screen flex items-center justify-center p-10 bg-white">
          <div class="w-64">
            <div class="shadow-xl rounded-2xl overflow-hidden bg-neutral-100 aspect-square flex items-center justify-center">
              \${cover?\`<img src="\${cover}" class="w-full h-full object-cover" onerror="this.style.opacity=.15">\`:'<span class="text-xs text-neutral-400">尚無封面圖</span>'}
            </div>
            <div class="pt-3">
              <div class="text-neutral-400 text-[0.7rem] tracking-[0.15em] uppercase">\${esc(d.category)}</div>
              <div class="font-bold text-[0.95rem] tracking-[0.1em] uppercase text-neutral-800">\${esc(d.title)||'作品標題'}</div>
              \${d.description?\`<p style="margin-top:12px;max-width:46ch;font-size:0.78rem;letter-spacing:.02em;line-height:1.8;color:rgba(23,23,23,.55)">\${esc(d.description)}</p>\`:''}
            </div>
          </div>
        </div>\`;
      }
      function clearHighlight(){
        document.querySelectorAll('.hl-bar').forEach(el=>el.style.opacity='0');
        document.querySelectorAll('.hl-box.on, #pv-hero.on, #pv-overlay.on, #pv-imgs.on').forEach(el=>el.classList.remove('on'));
      }
      function applyHighlight(target){
        clearHighlight();
        const barIds = { padTop:'pv-padTop', padBottom:'pv-padBottom', gap:'pv-gapBar' };
        const boxIds = { title:'pv-title', subtitle:'pv-subtitle', services:'pv-services', hero:'pv-hero', overlay:'pv-overlay', width:'pv-imgs' };
        if (barIds[target]) {
          const el = document.getElementById(barIds[target]);
          if (el) el.style.opacity = '1';
        } else if (boxIds[target]) {
          const el = document.getElementById(boxIds[target]);
          if (el) el.classList.add('on');
        }
      }
      window.addEventListener('message', e=>{
        const d = e.data||{};
        if (d.type==='highlight') { applyHighlight(d.target); return; }
        if (d.type==='unhighlight') { clearHighlight(); return; }
        if (d.type!=='render') return;
        document.getElementById('root').innerHTML = d.view==='wall'?renderWall(d):renderInner(d);
      });
      parent.postMessage({type:'previewReady'}, '*');
    <\/script>
    </body></html>`;
}

function updatePreview() {
  if (!previewReady) return;
  const payload = {
    type:'render', view: previewView,
    title: $('fTitle').value.trim(),
    subtitle: $('fSubtitle').value.trim(),
    category: $('fCategory').value.trim(),
    description: $('fDesc').value.trim(),
    services: $('fServices').value.split('\n').map(s=>s.trim()).filter(Boolean),
    heroBg: innerUrl(draft.main),
    heroOverlay: innerUrl(draft.overlay),
    heroOverlayW: draft.overlayW,
    images: draft.works.map(innerUrl).filter(Boolean),
    cover: imgUrl(draft.image),
    tmpl: templateSettings.work,
  };
  $('previewFrame').contentWindow.postMessage(payload, '*');
}

// ---- 儲存 ----

async function persist(msg) {
  const d = await api({ action:'save', works });
  $('stUpdated').textContent = d.updatedAt;
  renderStats();
  renderList();
  toast(msg);
  refreshStatusSoon();
}
let _statusTimer;
function refreshStatusSoon(){ clearTimeout(_statusTimer); _statusTimer=setTimeout(loadStatus, 800); }

async function loadStatus() {
  const d = await api({ action:'status' });
  works = d.works;
  renderStats(d);
  renderList();
  if (d.settings && d.settings.work) {
    templateSettings = d.settings;
    settingsDraft = { ...d.settings.work };
    fillSettingsForm();
    updateSettingsPreview();
  }
  if (d.about) { aboutBlocks = d.about.blocks || []; renderBlockEditor('about'); updateBlocksPreview('about'); }
  if (d.contact) { contactBlocks = d.contact.blocks || []; renderBlockEditor('contact'); updateBlocksPreview('contact'); }
  updatePreview();
}

// ---- 事件 ----

['fTitle','fSubtitle','fCategory','fServices','fDesc'].forEach(id => $(id).addEventListener('input', updatePreview));

$('fMain').onchange = async e => {
  const file = e.target.files[0]; if (!file) return;
  try {
    toast('背景圖上傳中⋯', 60000);
    const d = await uploadFile(file, 'inner', draftFolder());
    draft.inner_folder = d.folder; draft.main = d.filename; rememberDims(d);
    renderMainPreview(); updatePreview();
    toast('背景圖已上傳');
  } catch(err){ toast('⚠ ' + err.message, 4000); } finally { e.target.value=''; }
};

$('fOverlay').onchange = async e => {
  const file = e.target.files[0]; if (!file) return;
  try {
    toast('疊圖上傳中⋯', 60000);
    const d = await uploadFile(file, 'inner', draftFolder());
    draft.inner_folder = d.folder; draft.overlay = d.filename; rememberDims(d);
    renderMainPreview(); updatePreview();
    toast('疊圖已上傳');
  } catch(err){ toast('⚠ ' + err.message, 4000); } finally { e.target.value=''; }
};

$('fOverlayW').oninput = e => {
  draft.overlayW = +e.target.value;
  $('ovWval').textContent = draft.overlayW + '%';
  updatePreview();
};

$('rmOverlay').onclick = () => { draft.overlay=''; renderMainPreview(); updatePreview(); };
$('rmBg').onclick = () => { draft.main=''; renderMainPreview(); updatePreview(); };
$('bgEmpty').onclick = () => $('fMain').click();
$('ovEmpty').onclick = () => $('fOverlay').click();
$('addWorks').onclick = () => $('fWorks').click();
$('coverEmpty').onclick = () => $('fCover').click();
$('rmCover').onclick = () => { draft.image=''; renderMainPreview(); updatePreview(); };

async function addWorkFiles(fileList) {
  const imgs = [].slice.call(fileList).filter(f => f.type.startsWith('image/'));
  if (!imgs.length) { toast('請拖曳圖片檔'); return; }
  const folder = draftFolder();
  for (let i=0;i<imgs.length;i++) {
    try {
      toast(`作品圖上傳中（${i+1}/${imgs.length}）⋯`, 60000);
      const d = await uploadFile(imgs[i], 'inner', folder);
      draft.inner_folder = d.folder; draft.works.push(d.filename); rememberDims(d);
      renderWorksThumbs(); updatePreview();
    } catch(err){ toast('⚠ ' + imgs[i].name + '：' + err.message, 4000); }
  }
  toast('作品圖上傳完成');
}
$('fWorks').onchange = async e => { if (e.target.files.length) await addWorkFiles(e.target.files); e.target.value=''; };

// 作品集格：電腦圖檔拖進來 → 加進作品集；底圖/文字拖下來 → 移回作品集
const _wsl = $('worksSlot');
_wsl.addEventListener('dragover', e => {
  if (dragIdx >= 0 || (!dragHasFiles(e) && !heroDrag)) return;
  e.preventDefault(); e.dataTransfer.dropEffect = heroDrag ? 'move' : 'copy';
  _wsl.classList.add('drop-main');
});
_wsl.addEventListener('dragleave', e => {
  if (!_wsl.contains(e.relatedTarget)) _wsl.classList.remove('drop-main');
});
_wsl.addEventListener('drop', async e => {
  _wsl.classList.remove('drop-main');
  if (dragIdx >= 0) return;
  if (heroDrag) {
    e.preventDefault();
    const f = heroDrag === 'bg' ? draft.main : draft.overlay;
    if (f) {
      draft.works.unshift(f);
      if (heroDrag === 'bg') draft.main = ''; else draft.overlay = '';
      renderMainPreview(); renderWorksThumbs(); updatePreview();
      toast('已移回作品集');
    }
    heroDrag = null;
    return;
  }
  const files = e.dataTransfer ? e.dataTransfer.files : null;
  if (!files || !files.length) return;
  e.preventDefault();
  await addWorkFiles(files);
});

// 避免把圖檔拖到空白處時被瀏覽器直接開啟
['dragover','drop'].forEach(t => window.addEventListener(t, e => { if (dragHasFiles(e)) e.preventDefault(); }));

$('fCover').onchange = async e => {
  const file = e.target.files[0]; if (!file) return;
  try {
    toast('封面上傳中⋯', 60000);
    const d = await uploadFile(file, 'cover');
    draft.image = d.path;
    renderMainPreview(); updatePreview();
    toast('封面已上傳');
  } catch(err){ toast('⚠ ' + err.message, 4000); e.target.value=''; }
};

$('worksThumbs').onclick = e => {
  const bg = e.target.closest('[data-setbg]');
  if (bg) { setAsBg(+bg.dataset.setbg); return; }
  const ov = e.target.closest('[data-setov]');
  if (ov) { setAsOverlay(+ov.dataset.setov); return; }
  const b = e.target.closest('[data-rmwork]'); if (!b) return;
  draft.works.splice(+b.dataset.rmwork, 1);
  renderWorksThumbs(); updatePreview();
};

// 作品圖排序 — 指標拖曳：卡片 1:1 跟手、無系統殘影、即時讓位
let dragIdx = -1;   // 保留給檔案拖放判斷（此排序不使用）
const _wt = $('worksThumbs');
let ptr = null;

_wt.addEventListener('pointerdown', e => {
  const h = e.target.closest('.thumb-handle'); if (!h) return;
  const el = h.closest('.thumb');
  e.preventDefault();
  const thumbs = [].slice.call(_wt.querySelectorAll('.thumb'));
  const rects = thumbs.map(t => t.getBoundingClientRect());
  const i = +el.dataset.idx;
  ptr = { i, el, thumbs,
          startX: e.clientX, startY: e.clientY,
          rowH: rects.length > 1 ? rects[1].top - rects[0].top : rects[0].height + 8,
          target: i, overZone: null };
  el.classList.add('lifting');
  el.style.pointerEvents = 'none';
  try { h.setPointerCapture(e.pointerId); } catch(_) {}
});

_wt.addEventListener('pointermove', e => {
  if (!ptr) return;
  const dy = e.clientY - ptr.startY, dx = e.clientX - ptr.startX;
  ptr.el.style.transform = `translate(${dx}px,${dy}px)`;

  // 移到底圖／文字卡上？
  const under = document.elementFromPoint(e.clientX, e.clientY);
  const hero = under && under.closest ? under.closest('#heroCompose,#overlayDrop') : null;
  $('heroCompose').classList.toggle('over', !!hero && hero.id === 'heroCompose');
  $('overlayDrop').classList.toggle('over', !!hero && hero.id === 'overlayDrop');
  ptr.overZone = hero ? hero.id : null;
  if (hero) {
    ptr.thumbs.forEach(t => { if (t !== ptr.el) { t.style.transition = 'transform .18s ease'; t.style.transform = ''; } });
    ptr.target = ptr.i;
    return;
  }

  // 目標位置 = 依垂直距離換算，其他卡片滑動讓位
  let j = Math.round(ptr.i + dy / ptr.rowH);
  j = Math.max(0, Math.min(ptr.thumbs.length - 1, j));
  if (j !== ptr.target) {
    ptr.target = j;
    ptr.thumbs.forEach((t, k) => {
      if (t === ptr.el) return;
      let s = 0;
      if (ptr.i < j && k > ptr.i && k <= j) s = -ptr.rowH;
      else if (ptr.i > j && k < ptr.i && k >= j) s = ptr.rowH;
      t.style.transition = 'transform .18s ease';
      t.style.transform = s ? `translateY(${s}px)` : '';
    });
  }
});

function ptrEnd() {
  if (!ptr) return;
  const { i, target, overZone, el, thumbs } = ptr;
  ptr = null;
  el.classList.remove('lifting');
  el.style.pointerEvents = ''; el.style.transform = '';
  thumbs.forEach(t => { t.style.transition = ''; t.style.transform = ''; });
  $('heroCompose').classList.remove('over');
  $('overlayDrop').classList.remove('over');
  if (overZone === 'heroCompose') { setAsBg(i); return; }
  if (overZone === 'overlayDrop') { setAsOverlay(i); return; }
  if (target !== i) {
    const [m] = draft.works.splice(i, 1);
    draft.works.splice(target, 0, m);
    renderWorksThumbs(); updatePreview();
  }
}
_wt.addEventListener('pointerup', ptrEnd);
_wt.addEventListener('pointercancel', ptrEnd);

function dragHasFiles(e){ return e.dataTransfer && [].indexOf.call(e.dataTransfer.types, 'Files') >= 0; }

// 底圖／文字圖可往外拖
let heroDrag = null;
['mainPreview','overlayPreview'].forEach(id => {
  const el = $(id);
  el.draggable = true;
  el.addEventListener('dragstart', e => {
    heroDrag = id === 'mainPreview' ? 'bg' : 'ov';
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', heroDrag); } catch(_) {}
  });
  el.addEventListener('dragend', () => { heroDrag = null; });
});

function swapHero() {   // 底圖 ↔ 文字 互換
  const m = draft.main; draft.main = draft.overlay; draft.overlay = m;
  renderMainPreview(); updatePreview(); toast('底圖與文字已互換');
}

// 共用放置區：接受「作品集縮圖」「底圖/文字」「電腦圖檔」
function makeDropZone(el, onThumb, onFile, uploadingMsg, onHero) {
  el.addEventListener('dragover', e => {
    if (dragIdx < 0 && !heroDrag && !dragHasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = dragHasFiles(e) ? 'copy' : 'move';
    el.classList.add('over');
  });
  el.addEventListener('dragleave', e => {
    if (!el.contains(e.relatedTarget)) el.classList.remove('over');
  });
  el.addEventListener('drop', async e => {
    const files = e.dataTransfer ? e.dataTransfer.files : null;
    const hasFiles = files && files.length;
    if (dragIdx < 0 && !heroDrag && !hasFiles) return;
    e.preventDefault();
    el.classList.remove('over');
    if (dragIdx >= 0) { onThumb(dragIdx); dragIdx = -1; return; }
    if (heroDrag) { if (onHero) onHero(heroDrag); heroDrag = null; return; }
    const file = [].slice.call(files).find(f => f.type.startsWith('image/'));
    if (!file) { toast('請拖曳圖片檔'); return; }
    try {
      toast(uploadingMsg, 60000);
      const d = await uploadFile(file, 'inner', draftFolder());
      draft.inner_folder = d.folder;
      onFile(d.filename);
    } catch(err){ toast('⚠ ' + err.message, 4000); }
  });
}

// 底圖卡 / 文字卡（互拖 = 交換）
makeDropZone($('heroCompose'),
  setAsBg,
  (fn) => { draft.main = fn; renderMainPreview(); updatePreview(); toast('底圖已上傳'); },
  '底圖上傳中⋯',
  (k) => { if (k === 'ov') swapHero(); }
);
makeDropZone($('overlayDrop'),
  setAsOverlay,
  (fn) => { draft.overlay = fn; renderMainPreview(); updatePreview(); toast('文字已上傳'); },
  '文字上傳中⋯',
  (k) => { if (k === 'bg') swapHero(); }
);

$('saveWorkBtn').onclick = async () => {
  if (busy) return;
  const title = $('fTitle').value.trim();
  if (!title) { toast('標題是必填的'); return; }
  busy = true; $('saveWorkBtn').disabled = true;
  try {
    const entry = {
      id: editingIndex >= 0 ? works[editingIndex].id
          : String(Math.max(0, ...works.map(w=>parseInt(w.id)||0)) + 1),
      title,
      subtitle: $('fSubtitle').value.trim(),
      category: $('fCategory').value.trim(),
      services: $('fServices').value.split('\n').map(s=>s.trim()).filter(Boolean),
      image: draft.image,
      link: editingIndex >= 0 ? (works[editingIndex].link||'') : '',
      inner_folder: draft.inner_folder,
      inner_images: composeInnerImages(),
      inner_dims: composeInnerDims(),
      hero_bg: draft.main,
      hero_overlay: draft.overlay,
      hero_overlay_w: draft.overlayW,
      description: $('fDesc').value.trim(),
    };
    if (editingIndex >= 0) works[editingIndex] = entry;
    else works.unshift(entry);
    await persist(editingIndex >= 0 ? '已更新，網站同步生效' : '已新增，網站同步生效');
    resetEditor();
  } catch(err){ toast('⚠ ' + err.message, 4000); }
  busy = false; $('saveWorkBtn').disabled = false;
};

$('cancelEditBtn').onclick = resetEditor;

$('listSearch').addEventListener('input', e => { listQuery = e.target.value; renderList(); });

$('worksList').onclick = async e => {
  const isnew = e.target.closest('[data-new]');
  if (isnew) { resetEditor(); $('fTitle').focus(); return; }
  const del = e.target.closest('[data-del]');
  if (del) {
    e.stopPropagation();
    const i = +del.dataset.del;
    if (!confirm(`確定刪除「${works[i].title}」？\n（照片檔案會保留在主機上，只從網站清單移除）`)) return;
    works.splice(i,1);
    if (editingIndex === i) resetEditor();
    else if (editingIndex > i) editingIndex--;
    renderList();
    try { await persist('已刪除'); } catch(err){ toast('⚠ '+err.message,4000); }
    return;
  }
  const open = e.target.closest('[data-open]');
  if (open) loadEditor(+open.dataset.open);
};

// 右欄清單排序 — 同左欄手感：按住把手 1:1 跟手、即時讓位、放開才存檔
let lptr = null;
const _wl = $('worksList');
_wl.addEventListener('pointerdown', e => {
  const h = e.target.closest('.item-handle'); if (!h) return;
  const el = h.closest('.item');
  e.preventDefault();
  const items = [].slice.call(_wl.querySelectorAll('.item'));
  const rects = items.map(t => t.getBoundingClientRect());
  lptr = { i: +el.dataset.open, el, items,
           startY: e.clientY,
           rowH: rects.length > 1 ? rects[1].top - rects[0].top : rects[0].height + 8,
           target: +el.dataset.open };
  el.classList.add('lifting');
  el.style.pointerEvents = 'none';
  try { h.setPointerCapture(e.pointerId); } catch(_) {}
});
_wl.addEventListener('pointermove', e => {
  if (!lptr) return;
  const dy = e.clientY - lptr.startY;
  lptr.el.style.transform = `translateY(${dy}px)`;
  let j = Math.round(lptr.i + dy / lptr.rowH);
  j = Math.max(0, Math.min(lptr.items.length - 1, j));
  if (j !== lptr.target) {
    lptr.target = j;
    lptr.items.forEach((t, k) => {
      if (t === lptr.el) return;
      let s = 0;
      if (lptr.i < j && k > lptr.i && k <= j) s = -lptr.rowH;
      else if (lptr.i > j && k < lptr.i && k >= j) s = lptr.rowH;
      t.style.transition = 'transform .18s ease';
      t.style.transform = s ? `translateY(${s}px)` : '';
    });
  }
});
async function lptrEnd() {
  if (!lptr) return;
  const { i, target, el, items } = lptr;
  lptr = null;
  el.classList.remove('lifting');
  el.style.pointerEvents = ''; el.style.transform = '';
  items.forEach(t => { t.style.transition = ''; t.style.transform = ''; });
  if (target === i) return;
  const [m] = works.splice(i, 1);
  works.splice(target, 0, m);
  if (editingIndex === i) editingIndex = target;
  else if (i < editingIndex && target >= editingIndex) editingIndex--;
  else if (i > editingIndex && target <= editingIndex) editingIndex++;
  renderList();
  try { await persist('順序已更新'); } catch(err){ toast('⚠ '+err.message,4000); }
}
_wl.addEventListener('pointerup', lptrEnd);
_wl.addEventListener('pointercancel', lptrEnd);

$('backupList').onclick = async e => {
  const b = e.target.closest('[data-restore]'); if (!b) return;
  if (!confirm('確定還原到 ' + b.dataset.restore + '？目前版本會先自動備份。')) return;
  try {
    await api({ action:'restore', backup: b.dataset.restore });
    resetEditor();
    await loadStatus();
    toast('已還原');
  } catch(err){ toast('⚠ ' + err.message, 4000); }
};

$('logoutBtn').onclick = async () => { await api({action:'logout'}).catch(()=>{}); location.reload(); };

$('viewSeg').onclick = e => {
  const b = e.target.closest('[data-view]'); if (!b) return;
  previewView = b.dataset.view;
  [...$('viewSeg').children].forEach(x=>x.classList.toggle('active', x===b));
  updatePreview();
};
$('widthSeg').onclick = e => {
  const b = e.target.closest('[data-w]'); if (!b) return;
  previewWidth = b.dataset.w;
  [...$('widthSeg').children].forEach(x=>x.classList.toggle('active', x===b));
  $('frameWrap').classList.toggle('mobile', previewWidth==='mobile');
};

// ---- 分頁切換 ----

$('pageTabs').onclick = e => {
  const b = e.target.closest('[data-tab]'); if (!b) return;
  currentTab = b.dataset.tab;
  [...$('pageTabs').children].forEach(x=>x.classList.toggle('active', x===b));
  ['works','about','contact','settings'].forEach(t => { $('tab-'+t).style.display = t===currentTab ? '' : 'none'; });
  $('worksStats').style.display = currentTab==='works' ? '' : 'none';
  if (currentTab==='works') updatePreview();
  if (currentTab==='about') updateBlocksPreview('about');
  if (currentTab==='contact') updateBlocksPreview('contact');
  if (currentTab==='settings') updateSettingsPreview();
};

['about','contact','settings'].forEach(kind => {
  $(kind+'WidthSeg').onclick = e => {
    const b = e.target.closest('[data-w]'); if (!b) return;
    [...$(kind+'WidthSeg').children].forEach(x=>x.classList.toggle('active', x===b));
    $(kind+'FrameWrap').classList.toggle('mobile', b.dataset.w==='mobile');
  };
});

// ---- About / Contact：段落編輯器 ----

function renderBlockEditor(kind) {
  const blocks = kind==='about' ? aboutBlocks : contactBlocks;
  $(kind+'Blocks').innerHTML = blocks.map((b,i) => `
    <div class="blockrow" data-idx="${i}">
      <div class="bh">
        <select data-f="type">
          <option value="h1" ${b.type==='h1'?'selected':''}>大標 H1</option>
          <option value="h2" ${b.type==='h2'?'selected':''}>小標 H2</option>
          <option value="p" ${b.type==='p'?'selected':''}>內文 P</option>
        </select>
        <span class="spacer"></span>
        <button class="ghost" data-act="up" ${i===0?'disabled':''}>↑</button>
        <button class="ghost" data-act="down" ${i===blocks.length-1?'disabled':''}>↓</button>
        <button class="danger" data-act="rm">✕</button>
      </div>
      <textarea data-f="text" placeholder="文字內容">${esc(b.text)}</textarea>
      <div class="bnums ${b.type==='p'?'':'two'}">
        <div><label>字級 (px)</label><input type="text" inputmode="numeric" data-f="size" value="${b.size}"></div>
        <div><label>下間距 (px)</label><input type="text" inputmode="numeric" data-f="mb" value="${b.mb}"></div>
        ${b.type==='p'?`<div><label>行高</label><input type="text" inputmode="numeric" data-f="leading" value="${b.leading??2}"></div>`:''}
      </div>
    </div>
  `).join('') || '<p class="hint">尚無段落，點下方按鈕新增。</p>';
}

function bindBlockEvents(kind) {
  const root = $(kind+'Blocks');
  root.addEventListener('input', e => {
    const row = e.target.closest('.blockrow'); if (!row) return;
    const i = +row.dataset.idx;
    const blocks = kind==='about' ? aboutBlocks : contactBlocks;
    const f = e.target.dataset.f; if (!f || !blocks[i]) return;
    if (f==='text') blocks[i].text = e.target.value;
    else if (f==='size') blocks[i].size = parseInt(e.target.value)||14;
    else if (f==='mb') blocks[i].mb = parseInt(e.target.value)||0;
    else if (f==='leading') blocks[i].leading = parseFloat(e.target.value)||2;
    updateBlocksPreview(kind);
  });
  root.addEventListener('change', e => {
    const row = e.target.closest('.blockrow'); if (!row) return;
    const i = +row.dataset.idx;
    const blocks = kind==='about' ? aboutBlocks : contactBlocks;
    if (e.target.dataset.f==='type' && blocks[i]) {
      blocks[i].type = e.target.value;
      if (blocks[i].type==='p' && blocks[i].leading==null) blocks[i].leading = 2;
      renderBlockEditor(kind);
      updateBlocksPreview(kind);
    }
  });
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]'); if (!btn) return;
    const i = +btn.closest('.blockrow').dataset.idx;
    const blocks = kind==='about' ? aboutBlocks : contactBlocks;
    if (btn.dataset.act==='rm') blocks.splice(i,1);
    else if (btn.dataset.act==='up' && i>0) { const [m]=blocks.splice(i,1); blocks.splice(i-1,0,m); }
    else if (btn.dataset.act==='down' && i<blocks.length-1) { const [m]=blocks.splice(i,1); blocks.splice(i+1,0,m); }
    renderBlockEditor(kind);
    updateBlocksPreview(kind);
  });
}
bindBlockEvents('about');
bindBlockEvents('contact');

$('aboutAddBlock').onclick = () => { aboutBlocks.push({type:'p', text:'', size:14, mb:24, leading:2}); renderBlockEditor('about'); updateBlocksPreview('about'); };
$('contactAddBlock').onclick = () => { contactBlocks.push({type:'p', text:'', size:14, mb:24, leading:2}); renderBlockEditor('contact'); updateBlocksPreview('contact'); };

async function saveBlocks(kind) {
  const blocks = kind==='about' ? aboutBlocks : contactBlocks;
  try {
    const d = await api({ action: kind+'_save', blocks });
    if (kind==='about') aboutBlocks = d.blocks; else contactBlocks = d.blocks;
    renderBlockEditor(kind);
    updateBlocksPreview(kind);
    toast('已儲存，網站同步生效');
  } catch(err){ toast('⚠ ' + err.message, 4000); }
}
$('aboutSaveBtn').onclick = () => saveBlocks('about');
$('contactSaveBtn').onclick = () => saveBlocks('contact');

function previewDocBlocks(pTracking) {
  return `<!doctype html><html><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>html,body{background:#fff;margin:0}body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro TC","PingFang TC","Microsoft JhengHei",sans-serif;color:#1d1d1f}</style>
    </head><body><div id="root"></div>
    <script>
      const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const TYPE = { h1:'tracking-[0.2em] font-bold', h2:'tracking-[0.4em] text-neutral-500', p:'${pTracking} text-neutral-600' };
      const TAG = { h1:'h1', h2:'h2', p:'p' };
      function renderBlocks(blocks){
        return (blocks||[]).map(b=>{
          const tag = TAG[b.type]||'p';
          const cls = TYPE[b.type]||TYPE.p;
          const style = 'font-size:'+(b.size||14)+'px;margin-bottom:'+(b.mb||0)+'px;'+(b.leading?('line-height:'+b.leading+';'):'');
          return '<'+tag+' class="'+cls+' w-full max-w-2xl text-center mx-auto" style="'+style+'">'+esc(b.text)+'</'+tag+'>';
        }).join('') || '<p class="text-center text-sm text-neutral-300 py-16">尚無內容</p>';
      }
      window.addEventListener('message', e=>{
        const d = e.data||{};
        if (d.type!=='render') return;
        document.getElementById('root').innerHTML = '<div class="pt-16 pb-20 px-6 flex flex-col items-center text-center">'+renderBlocks(d.blocks)+'</div>';
      });
      parent.postMessage({type:'previewReady'}, '*');
    <\/script>
    </body></html>`;
}

function updateBlocksPreview(kind) {
  const ready = kind==='about' ? aboutPreviewReady : contactPreviewReady;
  if (!ready) return;
  const blocks = kind==='about' ? aboutBlocks : contactBlocks;
  $(kind+'PreviewFrame').contentWindow.postMessage({ type:'render', blocks }, '*');
}

// ---- 模板設定 ----

function fillSettingsForm() {
  document.querySelectorAll('#tab-settings .range-row').forEach(row => {
    const v = settingsDraft[row.dataset.k];
    row.querySelector('.rng').value = v;
    row.querySelector('.rngval').value = v;
  });
}
fillSettingsForm();

document.querySelectorAll('#tab-settings .range-row').forEach(row => {
  const k = row.dataset.k;
  const rng = row.querySelector('.rng');
  const num = row.querySelector('.rngval');
  const onInput = src => {
    const v = parseFloat(src.value);
    if (isNaN(v)) return;
    settingsDraft[k] = v;
    rng.value = v; num.value = v;
    updateSettingsPreview();
  };
  rng.addEventListener('input', () => onInput(rng));
  num.addEventListener('input', () => onInput(num));
});

document.querySelectorAll('#tab-settings .settings-field[data-hl]').forEach(field => {
  const hl = field.dataset.hl;
  field.addEventListener('mouseenter', () => {
    if (!settingsPreviewReady) return;
    $('settingsPreviewFrame').contentWindow.postMessage({ type:'highlight', target: hl }, '*');
  });
  field.addEventListener('mouseleave', () => {
    if (!settingsPreviewReady) return;
    $('settingsPreviewFrame').contentWindow.postMessage({ type:'unhighlight' }, '*');
  });
});

function updateSettingsPreview() {
  if (!settingsPreviewReady) return;
  const sample = works[0] || {};
  const folder = sample.inner_folder || '';
  const mediaUrl = f => f ? (SITE_BASE + 'media/projects/' + encodeURIComponent(folder) + '/' + encodeURIComponent(f) + '?v=2') : '';
  const payload = {
    type:'render', view:'inner',
    title: sample.title || 'SAMPLE WORK TITLE',
    subtitle: sample.subtitle || '範例副標題文字',
    description: sample.description || '這是作品描述文字範例，用來預覽版型變化。',
    services: (sample.services && sample.services.length) ? sample.services : ['VISUAL DESIGN / 主視覺設計','IDENTITY DESIGN / 識別設計'],
    heroBg: mediaUrl(sample.hero_bg),
    heroOverlay: mediaUrl(sample.hero_overlay),
    heroOverlayW: sample.hero_overlay_w || 60,
    images: (sample.inner_images||[]).slice(0,2).map(mediaUrl),
    cover: '',
    tmpl: settingsDraft,
  };
  $('settingsPreviewFrame').contentWindow.postMessage(payload, '*');
}

$('settingsSaveBtn').onclick = async () => {
  try {
    const d = await api({ action:'settings_save', settings: { work: settingsDraft } });
    templateSettings = d.settings;
    settingsDraft = { ...d.settings.work };
    fillSettingsForm();
    updateSettingsPreview();
    updatePreview();
    toast('模板設定已儲存，全部作品內頁已套用');
  } catch(err){ toast('⚠ ' + err.message, 4000); }
};

// ---- 啟動 ----

let aboutPreviewReady = false, contactPreviewReady = false, settingsPreviewReady = false;

window.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type !== 'previewReady') return;
  if (e.source === $('previewFrame').contentWindow) { previewReady = true; updatePreview(); }
  else if (e.source === $('aboutPreviewFrame').contentWindow) { aboutPreviewReady = true; updateBlocksPreview('about'); }
  else if (e.source === $('contactPreviewFrame').contentWindow) { contactPreviewReady = true; updateBlocksPreview('contact'); }
  else if (e.source === $('settingsPreviewFrame').contentWindow) { settingsPreviewReady = true; updateSettingsPreview(); }
});
$('previewFrame').srcdoc = previewDoc();
$('aboutPreviewFrame').srcdoc = previewDocBlocks('tracking-wider');
$('contactPreviewFrame').srcdoc = previewDocBlocks('tracking-widest');
$('settingsPreviewFrame').srcdoc = previewDoc();

loadStatus().catch(err => toast('⚠ ' + err.message, 5000));
</script>
<?php endif; ?>
</body>
</html>
