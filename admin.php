<?php
// ==================== ADMIN DEL BLOG ====================
// Va en public_html/admin.php
// La contraseña vive FUERA de public_html, en /home2/fecadbmi/blog-config.php
session_start();
require __DIR__ . '/../blog-config.php';

const POSTS_FILE = __DIR__ . '/posts.json';
const IMG_DIR    = __DIR__ . '/imgs/blog/';
const IMG_URL    = '/imgs/blog/';
const MAX_IMG    = 3 * 1024 * 1024; // 3 MB

// ---------- helpers ----------
function h($s) { return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }

function slugify($texto) {
    $texto = mb_strtolower(trim($texto), 'UTF-8');
    $texto = strtr($texto, ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n']);
    $texto = preg_replace('/[^a-z0-9]+/', '-', $texto);
    return trim($texto, '-') ?: 'articulo';
}

function cargar_posts() {
    if (!file_exists(POSTS_FILE)) return [];
    $data = json_decode(file_get_contents(POSTS_FILE), true);
    return is_array($data) ? $data : [];
}

function guardar_posts($posts) {
    file_put_contents(POSTS_FILE, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function volver($mensaje) {
    $_SESSION['flash'] = $mensaje;
    header('Location: admin.php');
    exit;
}

if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
$logueado = !empty($_SESSION['admin']);
$accion   = $_POST['accion'] ?? '';

// ---------- login / logout ----------
if ($accion === 'login') {
    if (hash_equals(ADMIN_PASSWORD, $_POST['password'] ?? '')) {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        volver('Bienvenida 👋');
    }
    sleep(2); // frena intentos de adivinar la contraseña
    volver('Contraseña incorrecta.');
}

if ($accion === 'logout') {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// ---------- acciones protegidas ----------
if ($logueado && $accion !== '') {
    if (!hash_equals($_SESSION['csrf'], $_POST['csrf'] ?? '')) volver('Sesión vencida, probá de nuevo.');

    if ($accion === 'crear') {
        $titulo    = trim($_POST['titulo'] ?? '');
        $resumen   = trim($_POST['resumen'] ?? '');
        $contenido = trim($_POST['contenido'] ?? '');
        if ($titulo === '' || $resumen === '' || $contenido === '') volver('Completá título, resumen y contenido.');

        $posts = cargar_posts();

        // slug único
        $base = slugify($titulo);
        $slug = $base;
        $usados = array_column($posts, 'slug');
        for ($i = 2; in_array($slug, $usados, true); $i++) $slug = "$base-$i";

        // imagen (opcional)
        $imagen = '';
        if (!empty($_FILES['imagen']['name'])) {
            $f = $_FILES['imagen'];
            if ($f['error'] !== UPLOAD_ERR_OK) volver('Error al subir la imagen.');
            if ($f['size'] > MAX_IMG) volver('La imagen pesa más de 3 MB.');

            $tipos = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
            $mime  = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
            if (!isset($tipos[$mime])) volver('La imagen tiene que ser JPG, PNG o WEBP.');

            if (!is_dir(IMG_DIR)) mkdir(IMG_DIR, 0755, true);
            $nombre = $slug . '.' . $tipos[$mime];
            if (!move_uploaded_file($f['tmp_name'], IMG_DIR . $nombre)) volver('No se pudo guardar la imagen.');
            $imagen = IMG_URL . $nombre;
        }

        array_unshift($posts, [
            'slug'      => $slug,
            'titulo'    => $titulo,
            'resumen'   => $resumen,
            'contenido' => $contenido,
            'imagen'    => $imagen,
            'fecha'     => date('Y-m-d'),
            'url'       => '/articulo.html?slug=' . $slug,
        ]);
        guardar_posts($posts);
        volver('Artículo publicado ✔');
    }

    if ($accion === 'borrar') {
        $slug  = $_POST['slug'] ?? '';
        $posts = cargar_posts();
        foreach ($posts as $i => $p) {
            if ($p['slug'] === $slug) {
                if (!empty($p['imagen'])) {
                    $archivo = IMG_DIR . basename($p['imagen']);
                    if (is_file($archivo)) unlink($archivo);
                }
                array_splice($posts, $i, 1);
                guardar_posts($posts);
                volver('Artículo borrado.');
            }
        }
        volver('No se encontró el artículo.');
    }
}

$flash = $_SESSION['flash'] ?? '';
unset($_SESSION['flash']);
$posts = $logueado ? cargar_posts() : [];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin Blog · Lamesalab</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#f6f7f2] text-[#44403c] font-sans min-h-screen">
<div class="max-w-3xl mx-auto px-5 py-12">

  <h1 class="text-3xl font-semibold mb-8">Admin del blog</h1>

  <?php if ($flash): ?>
    <div class="mb-6 rounded-lg bg-white border border-[#f0e9df] px-4 py-3"><?= h($flash) ?></div>
  <?php endif; ?>

  <?php if (!$logueado): ?>
    <!-- LOGIN -->
    <form method="post" class="bg-white rounded-2xl border border-[#f0e9df] p-6 space-y-4 max-w-sm">
      <input type="hidden" name="accion" value="login">
      <label class="block">
        <span class="text-sm font-medium">Contraseña</span>
        <input type="password" name="password" required autofocus class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2">
      </label>
      <button class="w-full rounded-full bg-[#44403c] hover:bg-[#292524] text-white font-semibold py-2.5">Entrar</button>
    </form>

  <?php else: ?>
    <!-- NUEVO ARTÍCULO -->
    <form method="post" enctype="multipart/form-data" class="bg-white rounded-2xl border border-[#f0e9df] p-6 space-y-4">
      <input type="hidden" name="accion" value="crear">
      <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
      <h2 class="text-xl font-semibold">Nuevo artículo</h2>

      <label class="block">
        <span class="text-sm font-medium">Título</span>
        <input type="text" name="titulo" required class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2">
      </label>

      <label class="block">
        <span class="text-sm font-medium">Resumen <span class="text-neutral-400">(se ve en la tarjeta)</span></span>
        <textarea name="resumen" rows="2" required class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"></textarea>
      </label>

      <label class="block">
        <span class="text-sm font-medium">Contenido <span class="text-neutral-400">(dejá una línea en blanco entre párrafos)</span></span>
        <textarea name="contenido" rows="12" required class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"></textarea>
      </label>

      <label class="block">
        <span class="text-sm font-medium">Imagen <span class="text-neutral-400">(JPG, PNG o WEBP, máx. 3 MB)</span></span>
        <input type="file" name="imagen" accept="image/jpeg,image/png,image/webp" class="mt-1 block w-full text-sm">
      </label>

      <button class="rounded-full bg-[#F4320B] hover:bg-[#a1501f] text-white font-semibold px-6 py-2.5">Publicar</button>
    </form>

    <!-- LISTA -->
    <h2 class="text-xl font-semibold mt-12 mb-4">Publicados (<?= count($posts) ?>)</h2>
    <div class="space-y-3">
      <?php foreach ($posts as $p): ?>
        <div class="flex items-center justify-between gap-4 bg-white rounded-xl border border-[#f0e9df] px-4 py-3">
          <div>
            <a href="<?= h($p['url']) ?>" target="_blank" class="font-medium hover:text-[#F4320B]"><?= h($p['titulo']) ?></a>
            <div class="text-xs text-neutral-500"><?= h($p['fecha'] ?? '') ?></div>
          </div>
          <form method="post" onsubmit="return confirm('¿Borrar este artículo?');">
            <input type="hidden" name="accion" value="borrar">
            <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
            <input type="hidden" name="slug" value="<?= h($p['slug']) ?>">
            <button class="text-sm text-red-600 hover:underline">Borrar</button>
          </form>
        </div>
      <?php endforeach; ?>
    </div>

    <form method="post" class="mt-10">
      <input type="hidden" name="accion" value="logout">
      <button class="text-sm text-neutral-500 hover:underline">Cerrar sesión</button>
    </form>
  <?php endif; ?>

</div>
</body>
</html>
