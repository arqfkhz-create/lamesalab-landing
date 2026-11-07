// Aviso de cookies: guarda la decisión del visitante y solo carga el píxel de Meta si acepta.
(function () {
  const CLAVE = "lamesalab-cookies";

  function leer() {
    try { return localStorage.getItem(CLAVE); } catch (e) { return null; }
  }

  function guardar(valor) {
    try { localStorage.setItem(CLAVE, valor); } catch (e) { /* sin almacenamiento: el aviso vuelve a salir */ }
  }

  // cargarPixelMeta solo existe en las páginas que tienen el píxel
  function activarPixel() {
    if (typeof window.cargarPixelMeta === "function") window.cargarPixelMeta();
  }

  function mostrarAviso() {
    if (document.getElementById("aviso-cookies")) return;

    const aviso = document.createElement("div");
    aviso.id = "aviso-cookies";
    aviso.setAttribute("role", "region");
    aviso.setAttribute("aria-label", "Aviso de cookies");
    aviso.className = "fixed bottom-0 inset-x-0 z-50 bg-white border-t border-sand shadow-lg";
    aviso.innerHTML = `
      <div class="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p class="text-sm text-ink-soft leading-relaxed">Usamos cookies de Meta para saber si nuestras campañas funcionan. Puedes aceptarlas o rechazarlas: el sitio funciona igual.</p>
        <div class="flex gap-3 shrink-0">
          <button type="button" data-cookies="rechazadas" class="flex-1 sm:flex-none rounded-md border border-ink-soft text-ink-soft text-sm font-semibold px-5 py-2.5">Rechazar</button>
          <button type="button" data-cookies="aceptadas" class="flex-1 sm:flex-none rounded-md border border-ink-soft bg-ink-soft text-white text-sm font-semibold px-5 py-2.5">Aceptar</button>
        </div>
      </div>`;

    aviso.querySelectorAll("button").forEach((boton) => {
      boton.addEventListener("click", () => {
        const anterior = leer();
        const decision = boton.dataset.cookies;
        guardar(decision);
        aviso.remove();
        if (decision === "aceptadas") activarPixel();
        // Si ya estaba aceptado, recargar es lo que apaga el píxel en esta visita
        else if (anterior === "aceptadas") location.reload();
      });
    });

    document.body.appendChild(aviso);
  }

  // Enlace en el footer para cambiar la decisión más adelante
  function agregarEnlaceFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Preferencias de cookies";
    boton.className = "block mx-auto pb-8 text-xs text-ink-soft/60 underline";
    boton.addEventListener("click", mostrarAviso);
    footer.appendChild(boton);
  }

  agregarEnlaceFooter();
  const decision = leer();
  if (decision === "aceptadas") activarPixel();
  else if (decision !== "rechazadas") mostrarAviso();
})();
