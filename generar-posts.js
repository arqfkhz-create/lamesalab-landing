// generar-posts.js
// Crea una página HTML por cada artículo del blog y actualiza sitemap.xml.
//
// Cómo usarlo: abre la terminal en la carpeta del proyecto y escribe
//   node generar-posts.js
// Hay que volver a ejecutarlo cada vez que agregas o cambias un artículo.

const fs = require("fs");
const POSTS = require("./js/posts-datos.js");

const SITIO = "https://lamesalab.com";
const MOLDE = "recursos/blog/index.html";

// Páginas fijas del sitio que también van al sitemap.
const PAGINAS_FIJAS = [
  "/",
  "/servicios/",
  "/quienes-somos/",
  "/faq/",
  "/recursos/",
  "/recursos/evaluacion/",
  "/recursos/blog/",
  "/diagnostico/",
];


// ---------- Ayudantes ----------

// Evita que unas comillas dentro del texto rompan un atributo, como content="...".
function escaparAtributo(texto) {
  return texto.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

// Busca el texto `inicio`, luego el texto `fin`, y cambia todo ese tramo (incluidos los dos) por `nuevo`.
function reemplazarEntre(html, inicio, fin, nuevo) {
  const desde = html.indexOf(inicio);
  const hasta = html.indexOf(fin, desde);

  if (desde === -1 || hasta === -1) {
    throw new Error("No encontré " + inicio + " ... " + fin + " en el molde.");
  }

  return html.slice(0, desde) + nuevo + html.slice(hasta + fin.length);
}

// "2026-11-08" -> "8 de noviembre de 2026"
function formatearFecha(fecha) {
  // Se agrega el mediodía para que la zona horaria no la corra al día anterior.
  const dia = new Date(fecha + "T12:00:00");
  return dia.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
}


// ---------- Partes de la página ----------

// Convierte la lista `contenido` en HTML: "## " es subtítulo, lo demás es párrafo.
function crearContenido(parrafos) {
  const partes = [];

  for (const parrafo of parrafos) {
    if (parrafo.startsWith("## ")) {
      const texto = parrafo.slice(3); // quita "## "
      partes.push(`<h2 class="font-display text-2xl md:text-3xl text-ink mt-10 mb-4">${texto}</h2>`);
    } else if (parrafo.startsWith("# ")) {
      // El título ya sale de `titulo`. Un "# " en el contenido se salta para no repetirlo.
      continue;
    } else {
      partes.push(`<p class="mb-5 leading-relaxed">${parrafo}</p>`);
    }
  }

  return partes.join("\n    ");
}

// Etiquetas para Google y para cuando se comparte el link en redes.
function crearEtiquetasSeo(post) {
  const url = SITIO + "/recursos/blog/" + post.slug + "/";
  const titulo = escaparAtributo(post.titulo);
  const descripcion = escaparAtributo(post.resumen);

  // Datos estructurados: le dicen a Google que esta página es un artículo.
  const datos = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.resumen,
    datePublished: post.fecha,
    url: url,
    author: { "@type": "Organization", name: "lamesalab" },
  };

  let etiquetas = `
  <meta name="description" content="${descripcion}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${titulo}">
  <meta property="og:description" content="${descripcion}">
  <meta property="og:url" content="${url}">
`;

  if (post.imagen) {
    datos.image = SITIO + post.imagen;
    etiquetas += `  <meta property="og:image" content="${SITIO}${post.imagen}">\n`;
  }

  etiquetas += `  <script type="application/ld+json">${JSON.stringify(datos)}</script>\n`;
  return etiquetas;
}

// El cuerpo del artículo, que reemplaza la sección del carrusel del molde.
function crearArticulo(post) {
  return `<main class="bg-sand/40 py-12">
  <article class="max-w-3xl mx-auto px-5 text-ink [&_p_a]:underline">
    <a href="/recursos/blog/" class="text-sm text-clay">← Volver al blog</a>
    <p class="text-sm text-ink-soft mt-8">${formatearFecha(post.fecha)}</p>
    <h1 class="font-display text-4xl md:text-5xl leading-tight tracking-tight mt-2 mb-8">${post.titulo}</h1>
    ${crearContenido(post.contenido)}
  </article>
</main>`;
}


// Arma la página completa a partir del molde.
function crearPagina(molde, post) {
  let html = molde;
  html = reemplazarEntre(html, "<title>", "</title>", "<title>" + post.titulo + " | lamesalab</title>");
  html = html.replace("</head>", crearEtiquetasSeo(post) + "</head>");
  html = reemplazarEntre(html, "<section", "</section>", crearArticulo(post));
  return html;
}

function crearSitemap(posts) {
  const urls = [];

  for (const pagina of PAGINAS_FIJAS) {
    urls.push(`  <url><loc>${SITIO}${pagina}</loc></url>`);
  }
  for (const post of posts) {
    urls.push(`  <url><loc>${SITIO}/recursos/blog/${post.slug}/</loc><lastmod>${post.fecha}</lastmod></url>`);
  }

  return '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.join("\n")
    + "\n</urlset>\n";
}


// ---------- Programa principal ----------

const molde = fs.readFileSync(MOLDE, "utf8");

// Solo se publican los artículos que tienen dirección y contenido.
const publicados = POSTS.filter((post) => post.slug && post.contenido);

for (const post of publicados) {
  const carpeta = "recursos/blog/" + post.slug;
  fs.mkdirSync(carpeta, { recursive: true }); // crea la carpeta si no existe
  fs.writeFileSync(carpeta + "/index.html", crearPagina(molde, post));
  console.log("Creada: /" + carpeta + "/");
}

fs.writeFileSync("sitemap.xml", crearSitemap(publicados));
console.log("sitemap.xml actualizado con " + publicados.length + " artículo(s).");