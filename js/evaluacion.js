(function () {
  "use strict";
 
  /* ==================== 1. DATOS ==================== */
 
  // Clave pública de Web3Forms (la misma del formulario de diagnóstico).
  const ACCESS_KEY = "39d57920-4999-4435-bfd0-e0dff4cf7f6a";
 
  const PILARES = {
    marca:      { numero: 1, nombre: "Branding y storytelling" },
    momentos:   { numero: 2, nombre: "Momentos de consumo" },
    ecosistema: { numero: 3, nombre: "Ecosistema digital" },
  };
 
  // Cada opción vale: A = 0, B = 1, C = 2.
  // "consejo" se muestra en el resultado si la respuesta fue A o B.
  const PREGUNTAS = [
    // ---------- Pilar 1 · Branding y storytelling ----------
    {
      pilar: "marca",
      texto: "Si alguien te pregunta por qué elegir tu negocio, ¿qué respondes?",
      opciones: [
        "\"Porque la comida es rica y tenemos buen servicio.\"",
        "Porque somos los mejores nuestros clientes lo saben.",
        "Lo digo en una frase clara: qué vendo, para quién y qué me hace distinto.",
      ],
      consejo: "Escribe tu propuesta de valor con esta plantilla: \"Hacemos ___ para ___ que quieren ___. Nos distingue ___.\" Léesela a alguien que no te conozca y ponla en tu bio y en Google.",
    },
    {
      pilar: "marca",
      texto: "¿Tienes un producto estrella?",
      opciones: [
        "No, vendo de todo un poco.",
        "Tengo varios que se venden bien, pero no los destaco.",
        "Sí, uno o dos productos por los que me reconocen, y los muestro siempre en redes.",
      ],
      consejo: "Elige 1 o 2 productos que más se venden o que mejor margen te dejan, y hazlos protagonistas de tus fotos, tu bio y tu menú.",
    },
    {
      pilar: "marca",
      texto: "¿Cómo se ve tu marca en redes, Google y el menú?",
      opciones: [
        "Cada lugar tiene un logo, colores o estilo distinto.",
        "Se parece, pero no siempre es igual.",
        "Mismo logo, mismos colores y mismo estilo de fotos en todos lados.",
      ],
      consejo: "Define un logo, 2 o 3 colores y un estilo de fotos (misma luz, mismo fondo) y úsalos igual en Instagram, Google y el menú.",
    },
    {
      pilar: "marca",
      texto: "¿Has contado la historia de tu negocio en redes?",
      opciones: [
        "No, solo publico fotos de productos y precios.",
        "Alguna vez, pero sin constancia.",
        "Sí, seguido: cómo empezamos, nuestras recetas, el equipo, los proveedores.",
      ],
      consejo: "Cuenta una historia por semana: cómo empezaste, una receta, tu equipo o un proveedor local. La gente le compra a personas, no a logos.",
    },
 
    // ---------- Pilar 2 · Momentos de consumo ----------
    {
      pilar: "momentos",
      texto: "¿Sabes cuáles son tus días y horarios más fuertes y más flojos?",
      opciones: [
        "No lo tengo claro.",
        "Tengo una idea, por intuición.",
        "Sí, lo sé con los números de mis ventas.",
      ],
      consejo: "Revisa las ventas de las últimas 4 semanas (caja, punto de venta o apps de delivery) y marca en una tabla los días y horarios fuertes y flojos.",
    },
    {
      pilar: "momentos",
      texto: "¿Qué haces en tus días flojos?",
      opciones: [
        "Nada en particular, espero que entre gente.",
        "Pongo descuentos, 2x1 y promociones exclusivas.",
        "Tengo una oferta especial sin descuento: plato del día, combo exclusivo o una actividad.",
      ],
      consejo: "Crea una oferta para tu día flojo que no sea un descuento: un plato del día, un combo exclusivo o una actividad. Los descuentos acostumbran al cliente a esperar el precio rebajado.",
    },
    {
      pilar: "momentos",
      texto: "¿Cuándo publicas en redes?",
      opciones: [
        "Cuando me acuerdo o tengo tiempo.",
        "Con cierta frecuencia, pero sin pensar en el horario.",
        "Antes de mis horarios de venta (por ejemplo, a media mañana si vendo almuerzos).",
      ],
      consejo: "Publica 1 o 2 horas antes de tus horarios de venta, cuando la gente está pensando qué va a comer.",
    },
    {
      pilar: "momentos",
      texto: "¿Cómo preparas las fechas fuertes del año (Acción de Gracias, Navidad, Día de las Madres)?",
      opciones: [
        "Me agarran de sorpresa.",
        "Hago algo a último momento.",
        "Las tengo en el calendario y las preparo con semanas de anticipación.",
      ],
      consejo: "Marca en el calendario las fechas fuertes del año y empieza a anunciarlas 2 o 3 semanas antes.",
    },
 
    // ---------- Pilar 3 · Ecosistema digital ----------
    {
      pilar: "ecosistema",
      texto: "Si buscas tu negocio en Google Maps, ¿qué aparece?",
      opciones: [
        "No aparece, o aparece con datos que no controlo.",
        "Aparece, pero falta algo: horario viejo, sin menú o fotos antiguas.",
        "Perfil completo: horario al día, menú, fotos recientes y teléfono.",
      ],
      consejo: "Busca tu negocio en Google Maps, reclama el perfil si no es tuyo y completa horario, menú, teléfono y al menos 10 fotos recientes.",
    },
    {
      pilar: "ecosistema",
      texto: "¿Qué dice tu bio de Instagram?",
      opciones: [
        "Solo el nombre o una frase genérica.",
        "Qué vendo, pero no dónde estoy ni cómo pedir.",
        "Qué vendo, dónde estoy y un enlace para pedir.",
      ],
      consejo: "Tu bio tiene que decir qué vendes, en qué pueblo o zona estás, y tener un enlace directo a WhatsApp o al menú.",
    },
    {
      pilar: "ecosistema",
      texto: "¿Qué haces con las reseñas de Google?",
      opciones: [
        "No las leo o no las respondo.",
        "Respondo solo las buenas.",
        "Respondo todas, también las negativas, y les pido reseñas a mis clientes.",
      ],
      consejo: "Responde todas tus reseñas, también las negativas, con calma y sin discutir. Pide reseñas con un QR en la mesa o un mensaje después del pedido, nunca a cambio de descuentos.",
    },
    {
      pilar: "ecosistema",
      texto: "Si un cliente te escribe por WhatsApp para pedir, ¿qué pasa?",
      opciones: [
        "Puede tardar horas o un día en recibir respuesta.",
        "Respondo cuando puedo, todo a mano.",
        "Tengo WhatsApp Business con catálogo y mensaje de bienvenida, y respondo rápido.",
      ],
      consejo: "Activa WhatsApp Business con catálogo, mensaje de bienvenida y respuestas rápidas, y define quién responde en los horarios de venta.",
    },
  ];
 
  const LETRAS = ["A", "B", "C"];
 
  /* ==================== 2. ESTADO ==================== */
 
  const respuestas = new Array(PREGUNTAS.length).fill(null); // 0, 1 o 2
  let actual = -1; // -1 = pantalla de inicio
 
  const card = document.getElementById("evaluacion");
  const pantalla = document.getElementById("pantalla");
  const progressWrap = document.getElementById("progress-wrap");
  const progressBar = document.getElementById("progress-bar");
  const progressLabel = document.getElementById("progress-label");
  const progressCount = document.getElementById("progress-count");
 
  // Evita que lo que escribe el usuario rompa el HTML.
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
 
  // Registra eventos en el píxel de Meta si está cargado.
  function pixel(evento, datos, personalizado) {
    if (typeof window.fbq !== "function") return;
    window.fbq(personalizado ? "trackCustom" : "track", evento, datos || {});
  }
 
  function subirAlInicio() {
    if (card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
 
  /* ==================== 3. PANTALLA DE INICIO ==================== */
 
  function renderInicio() {
    actual = -1;
    progressWrap.classList.add("hidden");
 
    pantalla.innerHTML = `
      <div class="paso text-center">
        <span class="text-sm font-semibold text-clay uppercase">Evaluación gratis · 5 minutos</span>
        <h1 class="font-display text-3xl sm:text-4xl font-semibold text-ink-soft tracking-tight leading-tight mt-3 text-balance">
          ¿Qué tan visible es tu negocio de comida?
        </h1>
        <p class="mt-4 text-lg max-w-xl mx-auto">
          Responde 12 preguntas y descubre qué está funcionando, qué te está haciendo perder clientes y por dónde empezar.
        </p>
 
        <div class="mt-8 grid sm:grid-cols-3 gap-5 text-left">
          ${Object.values(PILARES).map((p) => `
            <div class="border-t-2 border-ink-soft pt-3">
              <p class="text-xs font-semibold uppercase tracking-wider text-clay">Pilar ${p.numero}</p>
              <p class="font-semibold text-ink-soft mt-1">${p.nombre}</p>
            </div>`).join("")}
        </div>
 
        <button type="button" id="btn-empezar"
          class="mt-8 inline-flex items-center gap-2 rounded-md bg-clay hover:bg-ink-soft text-white font-semibold px-8 py-3.5 transition-colors">
          Empezar la evaluación
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </button>
        <p class="mt-3 text-xs text-ink-soft/70">Responde según cómo está tu negocio hoy, no cómo te gustaría que estuviera.</p>
      </div>`;
 
    document.getElementById("btn-empezar").addEventListener("click", () => {
      pixel("EvaluacionInicio", {}, true);
      renderPregunta(0);
    });
  }
 
  /* ==================== 4. PREGUNTAS ==================== */
 
  function renderPregunta(i) {
    actual = i;
    const p = PREGUNTAS[i];
    const pilar = PILARES[p.pilar];
    const elegida = respuestas[i];
 
    progressWrap.classList.remove("hidden");
    progressBar.style.width = Math.round((i / PREGUNTAS.length) * 100) + "%";
    progressLabel.textContent = "Pilar " + pilar.numero + " · " + pilar.nombre;
    progressCount.textContent = (i + 1) + " de " + PREGUNTAS.length;
 
    pantalla.innerHTML = `
      <div class="paso">
        <p class="text-xs font-semibold uppercase tracking-wider text-clay">Pregunta ${i + 1}</p>
        <h2 class="font-display text-2xl font-semibold text-ink-soft tracking-tight mt-2">${p.texto}</h2>
 
        <div class="mt-6 border-t border-ink-soft/30">
          ${p.opciones.map((texto, idx) => {
            const sel = elegida === idx;
            return `
              <button type="button" data-idx="${idx}"
                class="opcion w-full text-left border-b border-ink-soft/30 px-2 py-4 transition-colors flex items-baseline gap-4
                ${sel ? "bg-sand" : "hover:bg-sand/50"}">
                <span class="shrink-0 w-5 font-display text-lg font-semibold
                  ${sel ? "text-clay" : "text-ink-soft"}">${LETRAS[idx]}</span>
                <span class="text-ink-soft ${sel ? "font-semibold" : ""}">${texto}</span>
              </button>`;
          }).join("")}
        </div>
 
        <div class="mt-8 flex items-center justify-between gap-3">
          <button type="button" id="btn-atras" class="text-ink-soft font-semibold hover:text-ink transition-colors inline-flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12"/></svg>
            Atrás
          </button>
          ${elegida !== null ? `
            <button type="button" id="btn-siguiente" class="rounded-md bg-clay hover:bg-ink-soft text-white font-semibold px-7 py-3 transition-colors">
              ${i === PREGUNTAS.length - 1 ? "Ver mi resultado" : "Siguiente"}
            </button>` : ""}
        </div>
      </div>`;
 
    // Al elegir una opción: se marca y avanza sola.
    pantalla.querySelectorAll(".opcion").forEach((btn) => {
      btn.addEventListener("click", () => {
        respuestas[i] = Number(btn.dataset.idx);
        renderPregunta(i); // marca la opción elegida
        setTimeout(() => avanzar(i), 250);
      });
    });
 
    document.getElementById("btn-atras").addEventListener("click", () => {
      if (i === 0) renderInicio();
      else renderPregunta(i - 1);
      subirAlInicio();
    });
 
    const sig = document.getElementById("btn-siguiente");
    if (sig) sig.addEventListener("click", () => avanzar(i));
  }
 
  function avanzar(i) {
    if (actual !== i) return; // evita doble avance si el usuario ya se movió
    if (i < PREGUNTAS.length - 1) renderPregunta(i + 1);
    else renderResultado();
    subirAlInicio();
  }
 
  /* ==================== 5. RESULTADO ==================== */
 
  function calcular() {
    const porPilar = { marca: 0, momentos: 0, ecosistema: 0 };
    PREGUNTAS.forEach((p, i) => { porPilar[p.pilar] += respuestas[i] || 0; });
    const total = porPilar.marca + porPilar.momentos + porPilar.ecosistema;
 
    let nivel;
    if (total <= 8) {
      nivel = { nombre: "Construyendo las bases",
        texto: "Los clientes te buscan y no te encuentran, o no entienden por qué elegirte. La buena noticia: casi todo lo que te falta se arregla gratis.",
        paso: "Empieza por el pilar con menos puntos y resuelve los consejos de abajo, uno por día." };
    } else if (total <= 16) {
      nivel = { nombre: "En camino",
        texto: "Tienes lo básico, pero se te están perdiendo clientes en el camino.",
        paso: "Trabaja los consejos de abajo empezando por tu pilar más bajo. En pocas semanas vas a notar la diferencia." };
    } else {
      nivel = { nombre: "Listo para crecer",
        texto: "Tu presencia está ordenada y te encuentran con facilidad.",
        paso: "Ya puedes pensar en publicidad para llegar a más gente sin desperdiciar presupuesto." };
    }
    return { porPilar, total, nivel };
  }
 
  function estadoPilar(puntos) {
    if (puntos <= 3) return { nombre: "Prioridad", color: "#df2c1e", texto: "text-clay" };
    if (puntos <= 5) return { nombre: "Hay que ajustar", color: "#bf9000", texto: "text-[#8a6a22]" };
    return { nombre: "Bien resuelto", color: "#2f5248", texto: "text-sage-dark" };
  }
 
  function renderResultado() {
    actual = PREGUNTAS.length;
    progressWrap.classList.add("hidden");
 
    const { porPilar, total, nivel } = calcular();
    pixel("EvaluacionCompleta", { puntaje: total }, true);
 
    // Pilares ordenados de menor a mayor puntaje (el primero es la prioridad).
    const ordenados = Object.keys(PILARES).sort((a, b) => porPilar[a] - porPilar[b]);
 
    // Tarjetas de cada pilar (en orden 1, 2, 3)
    const tarjetas = Object.keys(PILARES).map((key) => {
      const pil = PILARES[key];
      const pts = porPilar[key];
      const est = estadoPilar(pts);
      return `
        <div class="border-t-2 border-ink-soft pt-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-ink">Pilar ${pil.numero}</p>
          <p class="font-semibold text-ink-soft mt-1">${pil.nombre}</p>
          <p class="font-display text-3xl font-semibold text-ink-soft mt-3">${pts}<span class="text-base text-ink"> / 8</span></p>
          <div class="h-1 bg-sand overflow-hidden mt-2">
            <div class="h-full" style="width:${(pts / 8) * 100}%; background:${est.color}"></div>
          </div>
          <span class="inline-block mt-2 ${est.texto} text-xs font-bold uppercase tracking-wider">${est.nombre}</span>
        </div>`;
    }).join("");
 
    // Consejos de las respuestas A y B, agrupados por pilar (primero el más bajo).
    const consejos = ordenados.map((key) => {
      const items = PREGUNTAS
        .map((p, i) => ({ p, i, r: respuestas[i] }))
        .filter((x) => x.p.pilar === key && x.r !== null && x.r < 2)
        .sort((a, b) => a.r - b.r); // primero las A
      if (!items.length) return "";
      return `
        <div class="mt-6">
          <h4 class="font-semibold text-ink-soft">${PILARES[key].nombre}</h4>
          <ul class="mt-3 space-y-3">
            ${items.map((x) => `
              <li class="flex gap-3">
                <span class="shrink-0 w-6 font-display font-semibold ${x.r === 0 ? "text-clay" : "text-[#8a6a22]"}">${x.i + 1}</span>
                <span>${x.p.consejo}</span>
              </li>`).join("")}
          </ul>
        </div>`;
    }).join("");
 
    const ctaDiagnostico = total >= 17
      ? `<a href="diagnostico/" class="rounded-md bg-clay hover:bg-ink-soft text-white font-semibold px-7 py-3.5 transition-colors text-center">Quiero crecer con publicidad</a>`
      : `<a href="diagnostico/" class="rounded-md border border-ink-soft hover:bg-sand text-ink-soft font-semibold px-7 py-3.5 transition-colors text-center">Quiero ayuda con mi negocio</a>`;
 
    pantalla.innerHTML = `
      <div class="paso">
        <div class="text-center">
          <span class="text-sm font-semibold text-clay uppercase">Tu resultado</span>
          <p class="font-display text-6xl font-semibold text-ink-soft mt-3">${total}<span class="text-2xl text-ink"> / 24</span></p>
          <h2 class="font-display text-2xl sm:text-3xl font-semibold text-ink-soft tracking-tight mt-2">${nivel.nombre}</h2>
          <p class="mt-3 text-lg max-w-xl mx-auto">${nivel.texto}</p>
        </div>
 
        <div class="mt-8 grid sm:grid-cols-3 gap-5">${tarjetas}</div>
 
        <div class="mt-8 bg-cream p-5 sm:p-6">
          <h3 class="font-display text-xl font-semibold text-ink-soft">Por dónde empezar</h3>
          <p class="mt-2">${nivel.paso}</p>
          ${consejos || `<p class="mt-4 font-semibold text-sage-dark">¡Respondiste C en todo! Tu presencia digital está muy bien resuelta.</p>`}
        </div>
 
        <!-- Formulario para recibir el resultado -->
        <div id="bloque-lead" class="mt-10 border-t-4 border-ink-soft pt-5">
          <h3 class="font-display text-xl font-semibold text-ink-soft">Recibe tu resultado y la guía gratis</h3>
          <p class="mt-2">Te mandamos tu evaluación y la Guía Express de presencia digital, con los pasos para mejorar cada punto.</p>
          <form id="form-lead" class="mt-6 space-y-6" novalidate>
            ${campo("nombre", "Tu nombre", "text", "Nombre")}
            ${campo("negocio", "Nombre del negocio", "text", "Ej. La Cocina de Ana")}
            ${campo("contacto", "WhatsApp o email", "text", "Ej. 787-555-1234")}
            <p id="lead-error" class="hidden text-sm text-clay font-semibold"></p>
            <button type="submit" id="btn-lead" class="w-full sm:w-auto rounded-md bg-clay hover:bg-ink-soft text-white font-semibold px-7 py-3.5 transition-colors">
              Enviarme mi resultado
            </button>
          </form>
        </div>
 
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          ${ctaDiagnostico}
          <button type="button" id="btn-reiniciar" class="rounded-md border border-ink-soft hover:bg-sand text-ink-soft font-semibold px-7 py-3.5 transition-colors">Volver a empezar</button>
        </div>
      </div>`;
 
    document.getElementById("form-lead").addEventListener("submit", (e) => {
      e.preventDefault();
      enviarLead(porPilar, total, nivel);
    });
    document.getElementById("btn-reiniciar").addEventListener("click", reiniciar);
  }
 
  function campo(name, label, type, placeholder) {
    return `
      <div>
        <label class="block text-sm font-semibold text-ink-soft" for="lead-${name}">${label} <span class="text-clay">*</span></label>
        <input id="lead-${name}" name="${name}" type="${type}" placeholder="${placeholder}" required
          class="w-full border-0 border-b-2 border-ink-soft/40 focus:border-clay px-0 py-2 outline-none transition-colors bg-transparent text-ink-soft" />
      </div>`;
  }
 
  /* ==================== 6. ENVÍO (Web3Forms) ==================== */
 
  function enviarLead(porPilar, total, nivel) {
    const form = document.getElementById("form-lead");
    const datos = {
      nombre: form.nombre.value.trim(),
      negocio: form.negocio.value.trim(),
      contacto: form.contacto.value.trim(),
    };
    const error = document.getElementById("lead-error");
 
    if (!datos.nombre || !datos.negocio || !datos.contacto) {
      error.textContent = "Completa los tres campos para enviarte tu resultado.";
      error.classList.remove("hidden");
      return;
    }
    error.classList.add("hidden");
 
    const btn = document.getElementById("btn-lead");
    btn.disabled = true;
    btn.textContent = "Enviando…";
 
    const payload = {
      access_key: ACCESS_KEY,
      subject: "Nueva evaluación lamesalab · " + total + "/24 · " + nivel.nombre,
      from_name: "Evaluación lamesalab",
      Tipo: "Evaluación de presencia digital",
      Nombre: datos.nombre,
      Negocio: datos.negocio,
      Contacto: datos.contacto,
      "Puntaje total": total + "/24",
      Nivel: nivel.nombre,
      "Branding y storytelling": porPilar.marca + "/8",
      "Momentos de consumo": porPilar.momentos + "/8",
      "Ecosistema digital": porPilar.ecosistema + "/8",
      Respuestas: respuestas.map((r, i) => (i + 1) + ":" + LETRAS[r]).join(", "),
    };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.contacto)) payload.replyto = datos.contacto;
 
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) throw new Error(res.message || "Error");
        pixel("Lead", { content_name: "Evaluacion presencia digital" });
        document.getElementById("bloque-lead").innerHTML = `
          <div class="text-center">
            <p class="font-display text-xl font-semibold text-ink-soft">¡Listo, ${esc(datos.nombre.split(" ")[0])}!</p>
            <p class="mt-2">En las próximas 24 horas te enviamos tu resultado y la guía a <strong class="text-ink-soft">${esc(datos.contacto)}</strong>.</p>
          </div>`;
      })
      .catch((err) => {
        console.error("[lamesalab] Error al enviar la evaluación:", err);
        btn.disabled = false;
        btn.textContent = "Enviarme mi resultado";
        error.textContent = "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.";
        error.classList.remove("hidden");
      });
  }
 
  function reiniciar() {
    respuestas.fill(null);
    renderInicio();
    subirAlInicio();
  }
 
  /* ==================== INICIO ==================== */
  renderInicio();
})();
 