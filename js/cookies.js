// Aviso informativo de cookies: se muestra hasta que el visitante toca "Entendido".
(function () {
  const CLAVE = "lamesalab-cookies";

  function yaVisto() {
    try { return localStorage.getItem(CLAVE) !== null; } catch (e) { return false; }
  }

  function guardarVisto() {
    try { localStorage.setItem(CLAVE, "visto"); } catch (e) { /* sin almacenamiento: el aviso vuelve a salir */ }
  }

  if (yaVisto()) return;

  const aviso = document.createElement("div");
  aviso.id = "aviso-cookies";
  aviso.setAttribute("role", "region");
  aviso.setAttribute("aria-label", "Aviso de cookies");
  aviso.className = "fixed bottom-0 inset-x-0 z-50 bg-white border-t border-sand shadow-lg";
  aviso.innerHTML = `
    <div class="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-ink-soft leading-relaxed">Este sitio usa cookies de Meta para medir si nuestras campañas funcionan.</p>
      <button type="button" class="shrink-0 rounded-md bg-ink-soft text-white text-sm font-semibold px-6 py-2.5">Entendido</button>
    </div>`;

  aviso.querySelector("button").addEventListener("click", () => {
    guardarVisto();
    aviso.remove();
  });

  document.body.appendChild(aviso);
})();
