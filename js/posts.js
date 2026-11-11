// Artículos del blog. El más nuevo va primero.
// Al tocar una tarjeta, el artículo se abre en una ventana sobre la página.
//
// Cada artículo lleva:
//   titulo:    el título.
//   resumen:   el texto corto de la tarjeta.
//   imagen:    opcional; ruta de la foto.
//   contenido: lista de párrafos. Lo que empieza con "## " se muestra como subtítulo.
//
// Ejemplo:
//   {
//     titulo: "Cómo saber si tus anuncios traen clientes",
//     resumen: "Tres datos que puedes revisar hoy.",
//     imagen: "/imgs/blog/anuncios.jpeg",
//     contenido: [
//       "Primer párrafo del artículo.",
//       "## Un subtítulo",
//       "Otro párrafo. Puede llevar <strong>negrita</strong>.",
//     ],
//   },

function crearTarjeta(post) {
  const imagen = post.imagen
    ? `<img src="${post.imagen}" alt="" class="w-full h-[200px] object-cover">`
    : "";

  return `
    <a href="/recursos/blog/${post.slug}/" class="snap-start shrink-0 w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col text-left rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      ${imagen}
      <span class="p-5 flex flex-col flex-1 w-full">
        <span class="block font-semibold text-lg text-ink mb-2">${post.titulo}</span>
        <span class="block text-sm text-ink-soft leading-relaxed">${post.resumen}</span>
        <span class="block mt-auto pt-4 text-sm font-semibold text-clay">Leer artículo →</span>
      </span>
    </a>`;
}

function mostrarPosts(posts) {
  const lista = document.getElementById("lista-blog");
  const anterior = document.getElementById("blog-anterior");
  const siguiente = document.getElementById("blog-siguiente");
  if (!lista) return;

  if (posts.length === 0) {
    lista.innerHTML = `<p class="text-ink-soft">Pronto publicaremos los primeros artículos.</p>`;
    anterior.hidden = true;
    siguiente.hidden = true;
    return;
  }

  lista.innerHTML = posts.map(crearTarjeta).join("");

  // Las flechas mueven la lista un "pantallazo" (tres tarjetas en computadora, una en celular).
  const mover = (direccion) => lista.scrollBy({ left: direccion * lista.clientWidth, behavior: "smooth" });
  anterior.onclick = () => mover(-1);
  siguiente.onclick = () => mover(1);

  // Desactiva cada flecha cuando ya no hay más artículos hacia ese lado.
  function actualizarFlechas() {
    const fin = lista.scrollWidth - lista.clientWidth;
    anterior.disabled = lista.scrollLeft <= 1;
    siguiente.disabled = lista.scrollLeft >= fin - 1;
    // Si entran todos en pantalla, no hacen falta flechas.
    anterior.hidden = siguiente.hidden = fin <= 1;
  }
  lista.onscroll = actualizarFlechas;
  window.addEventListener("resize", actualizarFlechas);
  actualizarFlechas();
}

mostrarPosts(POSTS.filter((p) => p.slug && p.contenido));