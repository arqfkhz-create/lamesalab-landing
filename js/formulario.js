(function () {
  "use strict";

  /* ==================== 1. DATOS: LAS PREGUNTAS ==================== */

  // Primera pregunta: decide qué camino sigue el formulario.
  //   "si" → paso de contacto rápido (PASO_CONTACTO_RAPIDO) y se envía.
  //   "no" → diagnóstico completo (PASOS_DIAGNOSTICO).
  const PASO_INICIAL = {
    key: "cliente",
    question: "¿Ya estás listo para comenzar a publicar?",
    help: "Si respondes que sí, cuéntanos un poco de tu negocio y te contactamos en menos de 24 horas.",
    type: "single",
    options: [
      { label: "Sí, ya tengo el negocio bien organizado y funcionando", value: "si", points: 0 },
      { label: "No, todavía necesito ayuda para organizar el negocio", value: "no", points: 0 },
    ],
  };

  // Paso extra que solo aparece si la primera respuesta es "Sí".
  const PASO_CONTACTO_RAPIDO = {
    key: "contactoRapido",
    question: "Cuéntanos de tu negocio",
    help: "Con estos datos te contactamos en el horario que prefieras.",
    type: "contact",
    errorMsg: "Completa los campos marcados con *.",
    fields: [
      { name: "negocio", label: "Nombre del negocio", input: "text", required: true, placeholder: "Ej. La Cocina de Ana" },
      { name: "ubicacion", label: "Ubicación", input: "text", required: true, placeholder: "Pueblo o zona (ej. Caguas)" },
      { name: "medio", label: "¿Cómo prefieres que te contactemos?", input: "select", required: true,
        options: ["WhatsApp", "Llamada", "Email", "Instagram"] },
      { name: "contacto", label: "Teléfono, email o usuario", input: "text", required: true, placeholder: "Ej. 787-555-1234" },
      { name: "horario", label: "Horario para contactarte", input: "select", required: true,
        options: ["Mañana (8:00 a 12:00)", "Tarde (12:00 a 5:00)", "Noche (5:00 a 8:00)", "Cualquier horario"] },
    ],
  };

  // Diagnóstico completo (camino "No").
  // points: puntaje que suma a la "preparación" (readiness).
  const PASOS_DIAGNOSTICO = [
    {
      key: "etapa",
      question: "¿En qué etapa está tu negocio de comida hoy?",
      help: "Elige la que más se parezca a tu situación.",
      type: "single",
      options: [
        { label: "Es una idea / recién empiezo", value: "idea", points: 0 },
        { label: "Ya está funcionando, tiene menos de un año", value: "funcionando", points: 1 },
        { label: "Está establecido hace más de un año y quiero hacerlo crecer", value: "establecido", points: 2 },
      ],
    },
    {
      key: "oferta",
      question: "¿Tienes una oferta o servicio claramente definido?",
      help: "Un producto o servicio con un precio y un cliente claro.",
      type: "single",
      options: [
        { label: "Todavía no lo tengo definido", value: "no", points: 0 },
        { label: "Más o menos, lo estoy afinando", value: "parcial", points: 1 },
        { label: "Sí, está claro y lo vendo", value: "si", points: 2 },
      ],
    },
    {
      key: "presencia",
      question: "¿Tienes presencia digital activa (Instagram, web, etc.)?",
      help: "Un canal donde tu cliente ya te puede encontrar.",
      type: "single",
      options: [
        { label: "No, no tengo tiempo", value: "no", points: 0 },
        { label: "Tengo, publico una vez al mes", value: "parcial", points: 1 },
        { label: "Sí, publico mínimo dos veces por semana", value: "si", points: 2 },
      ],
    },
    {
      key: "canal",
      question: "¿Tienes una forma clara de vender o cobrar?",
      help: "Un restaurante físico, dark kitchen, tienda online, WhatsApp de ventas, medios de pago, etc.",
      type: "single",
      options: [
        { label: "Todavía no, es informal", value: "no", points: 0 },
        { label: "Sí, tengo un canal de venta claro", value: "si", points: 1 },
      ],
    },
    {
      key: "inversion",
      question: "¿Estás en condiciones de invertir en publicidad mensual?",
      help: "Clave: Meta Ads necesita un presupuesto sostenido para funcionar.",
      type: "single",
      options: [
        { label: "No por ahora", value: "no", points: 0 },
        { label: "Puedo empezar con algo pequeño", value: "chico", points: 1 },
        { label: "Sí, tengo presupuesto asignado", value: "si", points: 2 },
      ],
    },
    {
      key: "dolor",
      question: "¿Cuál es tu mayor problema hoy?",
      help: "Elige el que más te pese. Esto nos ayuda a personalizar tu recomendación.",
      type: "single",
      options: [
        { label: "No sé cómo conseguir más clientes", value: "clientes", points: 0 },
        { label: "Vendo pero no me quedan ganancias (costos/precios)", value: "finanzas", points: 0 },
        { label: "Mi marca no comunica lo que soy", value: "marca", points: 0 },
        { label: "Estoy desordenado/a, no tengo sistema", value: "orden", points: 0 },
        { label: "Ya crezco pero quiero escalar con anuncios", value: "escalar", points: 0 },
      ],
    },
    {
      key: "contacto",
      question: "¿A dónde te enviamos tu diagnóstico?",
      help: "Déjanos tus datos para mandarte el resultado y los próximos pasos.",
      type: "contact",
      errorMsg: "Completa tu nombre y un email válido.",
      fields: [
        { name: "nombre", label: "Tu nombre", input: "text", required: true, placeholder: "Nombre" },
        { name: "email", label: "Email", input: "email", required: true, placeholder: "tucorreo@email.com" },
        { name: "negocio", label: "Nombre del negocio (opcional)", input: "text", required: false, placeholder: "Mi negocio" },
      ],
    },
  ];

  // Convierte el "dolor" en un mensaje personalizado para el resultado.
  const DOLOR_TIP = {
    clientes: "conseguir clientes de forma más previsible",
    finanzas: "ordenar costos y precios para que te queden ganancias",
    marca:    "que tu marca comunique con claridad quién eres",
    orden:    "poner un sistema para dejar de trabajar sin organización",
    escalar:  "escalar lo que ya funciona con publicidad",
  };

  /* ==================== 2. ESTADO ==================== */

  const answers = {};
  let current = 0;

  const form = document.getElementById("diag-form");
  const resultado = document.getElementById("resultado");
  const progressBar = document.getElementById("progress-bar");
  const progressLabel = document.getElementById("progress-label");
  const progressCount = document.getElementById("progress-count");
  const progressWrap = document.getElementById("progress-wrap");

  // Devuelve la lista de pasos según la primera respuesta.
  function getSteps() {
    const eligioSi = answers.cliente && answers.cliente.value === "si";
    return eligioSi
      ? [PASO_INICIAL, PASO_CONTACTO_RAPIDO]
      : [PASO_INICIAL, ...PASOS_DIAGNOSTICO];
  }

  function esCaminoRapido() {
    return answers.cliente && answers.cliente.value === "si";
  }

  // Evita que lo que escribe el usuario rompa el HTML.
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ==================== 3. MOSTRAR UN PASO ==================== */

  function renderStep(i) {
    const steps = getSteps();
    const step = steps[i];
    let inner = "";

    inner += `<div class="animate-[fadeIn_.3s_ease]">`;
    inner += `<h3 class="font-display text-2xl font-semibold tracking-tight">${step.question}</h3>`;
    if (step.help) inner += `<p class="mt-2 text-ink-soft">${step.help}</p>`;

    if (step.type === "single") {
      inner += `<div class="mt-6 space-y-3">`;
      step.options.forEach((opt) => {
        const selected = answers[step.key] && answers[step.key].value === opt.value;
        inner += `
          <button type="button" data-value="${opt.value}" data-points="${opt.points}"
            class="opt w-full text-left rounded-xl border-2 px-5 py-4 transition-all
            ${selected ? "border-clay bg-clay/5" : "border-sand hover:border-clay/50 hover:bg-sand/40"}">
            <span class="flex items-center gap-3">
              <span class="shrink-0 w-5 h-5 rounded-full border-2 ${selected ? "border-clay bg-clay" : "border-ink/30"} flex items-center justify-center">
                ${selected ? '<span class="w-2 h-2 rounded-full bg-white"></span>' : ""}
              </span>
              <span class="font-medium">${opt.label}</span>
            </span>
          </button>`;
      });
      inner += `</div>`;
    }

    if (step.type === "contact") {
      inner += `<div class="mt-6 space-y-4">`;
      step.fields.forEach((f) => {
        const val = (answers[step.key] && answers[step.key][f.name]) || "";
        const req = f.required ? ' <span class="text-clay">*</span>' : "";
        const clases = "w-full rounded-xl border-2 border-sand focus:border-clay focus:ring-0 px-4 py-3 outline-none transition-colors bg-white";

        inner += `<div><label class="block text-sm font-semibold mb-1.5">${f.label}${req}</label>`;

        if (f.input === "select") {
          inner += `<select name="${f.name}" ${f.required ? "required" : ""} class="${clases}">
            <option value="">Elige una opción</option>
            ${f.options.map((o) => `<option value="${esc(o)}" ${val === o ? "selected" : ""}>${o}</option>`).join("")}
          </select>`;
        } else {
          inner += `<input type="${f.input}" name="${f.name}" value="${esc(val)}" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""}
            class="${clases}" />`;
        }

        inner += `</div>`;
      });
      inner += `<p id="contact-error" class="hidden text-sm text-clay-dark font-semibold"></p>`;
      inner += `</div>`;
    }

    inner += `</div>`;

    // Navegación: Atrás / Siguiente
    inner += `<div class="mt-8 flex items-center justify-between gap-3">`;
    inner += i > 0
      ? `<button type="button" id="btn-back" class="text-ink-soft font-semibold hover:text-ink transition-colors inline-flex items-center gap-1">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12"/></svg>
           Atrás</button>`
      : `<span></span>`;

    const isLast = i === steps.length - 1;
    const textoFinal = esCaminoRapido() ? "Enviar mis datos" : "Ver mi diagnóstico";
    inner += `<button type="button" id="btn-next"
      class="rounded-full bg-ink hover:bg-ink-soft text-cream font-semibold px-7 py-3 transition-colors inline-flex items-center gap-2">
      ${isLast ? textoFinal : "Siguiente"}
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </button>`;
    inner += `</div>`;

    form.innerHTML = inner;
    updateProgress(i);
    wireStep(step, i);
  }

  function wireStep(step, i) {
    if (step.type === "single") {
      form.querySelectorAll(".opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          answers[step.key] = {
            value: btn.dataset.value,
            points: Number(btn.dataset.points),
          };
          renderStep(i); // marca la opción elegida (y actualiza el total de pasos)
        });
      });
    }

    const back = document.getElementById("btn-back");
    if (back) back.addEventListener("click", goPrev);

    const next = document.getElementById("btn-next");
    if (next) next.addEventListener("click", goNext);
  }

  /* ==================== 4. NAVEGACIÓN ==================== */

  function goNext() {
    const steps = getSteps();
    const step = steps[current];

    if (step.type === "single" && !answers[step.key]) {
      flashError("Elige una opción para continuar.");
      return;
    }

    if (step.type === "contact") {
      const data = {};
      let ok = true;
      step.fields.forEach((f) => {
        const el = form.querySelector(`[name="${f.name}"]`);
        data[f.name] = el ? el.value.trim() : "";
        if (f.required && !data[f.name]) ok = false;
        if (f.input === "email" && data[f.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[f.name])) ok = false;
      });
      const err = document.getElementById("contact-error");
      if (!ok) {
        if (err) { err.textContent = step.errorMsg || "Completa los campos obligatorios."; err.classList.remove("hidden"); }
        return;
      }
      answers[step.key] = data;
    }

    if (current < steps.length - 1) {
      current++;
      renderStep(current);
    } else if (esCaminoRapido()) {
      finishRapido();
    } else {
      finish();
    }
  }

  function goPrev() {
    if (current > 0) {
      current--;
      renderStep(current);
    }
  }

  function flashError(msg) {
    let el = document.getElementById("step-error");
    if (!el) {
      el = document.createElement("p");
      el.id = "step-error";
      el.className = "mt-4 text-sm text-clay-dark font-semibold";
      form.appendChild(el);
    }
    el.textContent = msg;
  }

  function updateProgress(i) {
    const total = getSteps().length;
    const pct = Math.round((i / (total - 1)) * 100);
    progressBar.style.width = pct + "%";
    progressLabel.textContent = "Paso " + (i + 1);
    progressCount.textContent = (i + 1) + " de " + total;
  }

  function scrollToForm() {
    document.getElementById("diagnostico").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function mostrarResultado(html) {
    form.classList.add("hidden");
    progressWrap.classList.add("hidden");
    resultado.classList.remove("hidden");
    resultado.innerHTML = html;

    const reset = document.getElementById("btn-reset");
    if (reset) reset.addEventListener("click", resetForm);

    scrollToForm();
  }

  /* ==================== 5A. CAMINO RÁPIDO ("Sí") ==================== */

  function finishRapido() {
    const d = answers.contactoRapido || {};
    const html = `
      <div class="text-center">
        <span class="inline-flex items-center gap-2 rounded-full text-clay-dark text-xs font-bold uppercase tracking-wider px-3 py-1.5">
          Datos recibidos
        </span>
        <h3 class="font-display text-3xl font-semibold tracking-tight mt-4">
          ¡Gracias${d.negocio ? ", " + esc(d.negocio) : ""}! Te contactamos en menos de 24 horas.
        </h3>
        <p class="mt-4 text-ink-soft text-lg max-w-xl mx-auto">
          Te vamos a escribir por <strong class="text-ink">${esc(d.medio || "el medio que elegiste")}</strong>
          en el horario <strong class="text-ink">${esc((d.horario || "").toLowerCase())}</strong>
          para conocer tu negocio y ver por dónde conviene empezar.
        </p>
      </div>
      <div class="mt-8 flex justify-center">
        <button type="button" id="btn-reset" class="rounded-full border border-ink/20 hover:border-ink font-semibold px-7 py-3.5 transition-colors">Volver a empezar</button>
      </div>`;

    mostrarResultado(html);
    enviarLeadRapido();
  }

  function enviarLeadRapido() {
    const d = answers.contactoRapido || {};
    const payload = {
      access_key: "39d57920-4999-4435-bfd0-e0dff4cf7f6a",
      subject: "Nuevo contacto directo lamesalab · " + (d.negocio || "Sin nombre"),
      from_name: "Formulario lamesalab",
      Tipo: "Contacto directo (listo para publicar)",
      Negocio: d.negocio || "",
      Ubicacion: d.ubicacion || "",
      "Medio de contacto": d.medio || "",
      Contacto: d.contacto || "",
      "Horario para contactar": d.horario || "",
    };
    // Si eligió Email, permite responder directo desde el correo.
    if (d.medio === "Email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contacto || "")) {
      payload.replyto = d.contacto;
    }
    enviar(payload);
  }

  /* ==================== 5B. DIAGNÓSTICO COMPLETO ("No") ==================== */

  function clasificar() {
    // Puntaje de "preparación" (readiness), sin contar el dolor. Máximo = 9.
    let score = 0;
    ["etapa", "oferta", "presencia", "canal", "inversion"].forEach((k) => {
      if (answers[k]) score += answers[k].points;
    });
    const inversion = answers.inversion ? answers.inversion.value : "no";
    const dolor = answers.dolor ? answers.dolor.value : "";

    // Para "escalar" hace falta estar dispuesto a invertir y tener bases razonables.
    const dispuestoAInvertir = inversion === "chico" || inversion === "si";
    const categoria = dispuestoAInvertir && score >= 6 ? "escalar" : "bases";

    return { categoria, score, dolor, inversion };
  }

  function finish() {
    const { categoria, score, dolor } = clasificar();
    const nombre = (answers.contacto && answers.contacto.nombre) ? esc(answers.contacto.nombre.split(" ")[0]) : "";
    const tip = DOLOR_TIP[dolor] || "dar el próximo paso con claridad";

    let html = "";

    if (categoria === "bases") {
      html = `
        <div class="text-center">
          <span class="inline-flex items-center gap-2 rounded-full bg-sage/10 text-sage-dark text-xs font-bold uppercase tracking-wider px-3 py-1.5">
            Categoría 1 · Bases primero
          </span>
          <h3 class="font-display text-3xl font-semibold tracking-tight mt-4">
            ${nombre ? nombre + ", t" : "T"}odavía no es momento de pautar, y está perfecto.
          </h3>
          <p class="mt-4 text-ink-soft text-lg max-w-xl mx-auto">
            Invertir en Meta Ads ahora sería perder presupuesto. Primero conviene ordenar las bases:
            así, cuando pautes, cada dólar rinde. Te podemos ayudar a <strong class="text-ink">${tip}</strong>
            con herramientas gratuitas y consultoría puntual.
          </p>
        </div>
        <div class="mt-8 grid sm:grid-cols-3 gap-3 text-left">
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-semibold">Diagnóstico honesto</p><p class="text-sm text-ink-soft mt-1">Qué te falta y en qué orden resolverlo.</p></div>
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-semibold">Herramienta gratuita</p><p class="text-sm text-ink-soft mt-1">Un recurso puntual para tu problema de hoy.</p></div>
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-semibold">Consultoría puntual</p><p class="text-sm text-ink-soft mt-1">Una sesión enfocada, sin comprometerte a más.</p></div>
        </div>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:infolamesalab@gmail.com?subject=Quiero%20mi%20herramienta%20gratuita" class="rounded-full bg-clay hover:bg-clay-dark text-white font-semibold px-7 py-3.5 text-center transition-colors">Quiero mi herramienta gratuita</a>
          <button type="button" id="btn-reset" class="rounded-full border border-ink/20 hover:border-ink font-semibold px-7 py-3.5 transition-colors">Volver a empezar</button>
        </div>`;
    } else {
      html = `
        <div class="text-center">
          <span class="inline-flex items-center gap-2 rounded-full bg-clay/10 text-clay-dark text-xs font-bold uppercase tracking-wider px-3 py-1.5">
            Categoría 2 · Listo para escalar
          </span>
          <h3 class="font-display text-3xl font-semibold tracking-tight mt-4">
            ${nombre ? "¡" + nombre + ", e" : "¡E"}stás en condiciones de escalar con publicidad!
          </h3>
          <p class="mt-4 text-ink-soft text-lg max-w-xl mx-auto">
            Tienes las bases y estás dispuesto a invertir. Es el momento de armar una estrategia integral
            (oferta, mensaje, embudo y campañas de Meta Ads) para <strong class="text-ink">${tip}</strong> con números claros.
          </p>
        </div>
        <div class="mt-8 grid sm:grid-cols-3 gap-3 text-left">
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-semibold">Estrategia integral</p><p class="text-sm text-ink-soft mt-1">Del posicionamiento a la campaña, todo conectado.</p></div>
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-semibold">Campañas Meta Ads</p><p class="text-sm text-ink-soft mt-1">Estructura, creativos y optimización con datos.</p></div>
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-semibold">Métricas claras</p><p class="text-sm text-ink-soft mt-1">Saber qué funciona y cuánto te deja.</p></div>
        </div>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:infolamesalab@gmail.com?subject=Quiero%20escalar%20con%20publicidad" class="rounded-full bg-ink hover:bg-ink-soft text-cream font-semibold px-7 py-3.5 text-center transition-colors">Agendar una llamada</a>
          <button type="button" id="btn-reset" class="rounded-full border border-ink/20 hover:border-ink font-semibold px-7 py-3.5 transition-colors">Volver a empezar</button>
        </div>`;
    }

    // Resumen de respuestas
    html += `
      <details class="mt-8 text-sm text-ink-soft/80">
        <summary class="cursor-pointer font-semibold hover:text-ink">Ver resumen de tus respuestas</summary>
        <div class="mt-3 rounded-xl bg-sand/50 p-4 font-mono text-xs leading-relaxed">
          ${resumenTexto(categoria, score)}
        </div>
      </details>`;

    mostrarResultado(html);
    enviarLead(categoria, score);
  }

  function labelDe(key) {
    if (!answers[key]) return "(sin responder)";
    const s = PASOS_DIAGNOSTICO.find((st) => st.key === key);
    const opt = s && s.options.find((o) => o.value === answers[key].value);
    return opt ? opt.label : answers[key].value;
  }

  function enviarLead(categoria, score) {
    const c = answers.contacto || {};
    const payload = {
      access_key: "39d57920-4999-4435-bfd0-e0dff4cf7f6a",
      subject: "Nuevo diagnóstico lamesalab · " +
        (categoria === "escalar" ? "Categoría 2 (Escalar)" : "Categoría 1 (Bases)"),
      from_name: "Formulario lamesalab",
      replyto: c.email || "",
      Tipo: "Diagnóstico completo",
      Nombre: c.nombre || "",
      Email: c.email || "",
      Negocio: c.negocio || "(no indicó)",
      Categoria: categoria === "escalar" ? "2 - Listo para escalar" : "1 - Bases primero",
      Puntaje: score + "/9",
      Etapa: labelDe("etapa"),
      Oferta: labelDe("oferta"),
      "Presencia digital": labelDe("presencia"),
      "Canal de venta": labelDe("canal"),
      Inversion: labelDe("inversion"),
      "Dolor principal": labelDe("dolor"),
    };
    enviar(payload);
  }

  function resumenTexto(categoria, score) {
    const map = {
      etapa: "Etapa", oferta: "Oferta", presencia: "Presencia",
      canal: "Canal de venta", inversion: "Inversión", dolor: "Dolor principal",
    };
    let out = `categoria: ${categoria} · readiness: ${score}/9<br>`;
    Object.keys(map).forEach((k) => {
      if (!answers[k]) return;
      out += `${map[k]}: ${labelDe(k)}<br>`;
    });
    if (answers.contacto) {
      out += `Contacto: ${esc(answers.contacto.nombre)} · ${esc(answers.contacto.email)}`;
      if (answers.contacto.negocio) out += ` · ${esc(answers.contacto.negocio)}`;
    }
    return out;
  }

  /* ==================== 6. ENVÍO (Web3Forms) ==================== */

  function enviar(payload) {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => console.log("[lamesalab] Lead enviado:", data.success))
      .catch((err) => console.error("[lamesalab] Error al enviar lead:", err));
  }

  function resetForm() {
    Object.keys(answers).forEach((k) => delete answers[k]);
    current = 0;
    resultado.classList.add("hidden");
    resultado.innerHTML = "";
    form.classList.remove("hidden");
    progressWrap.classList.remove("hidden");
    renderStep(0);
  }

  /* ==================== INICIO ==================== */
  renderStep(0);
})();