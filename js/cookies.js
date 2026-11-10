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
  aviso.className = "fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-80 z-50 bg-cream border border-ink-soft border-t-4 px-4 py-3";
  aviso.innerHTML = `
    <p class="font-display text-[15px] text-ink-soft leading-snug">Este sitio usa cookies de Meta para medir si nuestras campañas funcionan.</p>
    <button type="button" class="mt-2 py-1 text-sm font-semibold text-ink-soft underline underline-offset-4 decoration-clay decoration-2 hover:text-clay">Entendido</button>`;

  aviso.querySelector("button").addEventListener("click", () => {
    guardarVisto();
    aviso.remove();
  });

  document.body.appendChild(aviso);
})();

