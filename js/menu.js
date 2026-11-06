(function () {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu-movil");
  const abrir = document.getElementById("icono-abrir");
  const cerrar = document.getElementById("icono-cerrar");
  if (!btn || !menu) return;

  function setMenu(open) {
    menu.classList.toggle("hidden", !open);
    abrir.classList.toggle("hidden", open);
    cerrar.classList.toggle("hidden", !open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  btn.addEventListener("click", () => setMenu(menu.classList.contains("hidden")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
})();