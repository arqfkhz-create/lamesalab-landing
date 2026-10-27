/* ============================================================
   lamesalab — Diagnóstico interactivo
   Clasifica al usuario en 2 categorías según sus respuestas:
     - "bases"  → todavía no tiene lo necesario para Meta Ads
                  => herramientas gratuitas / consultoría puntual
     - "escalar"→ nivel más avanzado + dispuesto a invertir
                  => estrategia integral + publicidad
   Fácil de ajustar: cambiá las preguntas en STEPS y el umbral
   en clasificar().
   ============================================================ */

(function () {
  "use strict";

  // Definición de preguntas 
  // points: puntaje que suma a "preparación". points = readiness.
  const STEPS = [
    {
      key: "etapa", // seria el id de cada pregunta para acceder mas rapido
      question: "¿En qué etapa está tu negocio hoy?",
      help: "Elegí la que más se parezca a tu situación.", // placeholder
      type: "single", 
      options: [
        { label: "Es una idea / recién arranco", value: "idea", points: 0 },
        { label: "Ya está funcionando, pero sin un sistema claro", value: "funcionando", points: 1 },
        { label: "Está establecido y quiero escalarlo", value: "establecido", points: 2 },
      ],
    },
    {
      key: "oferta",
      question: "¿Tenés una oferta o servicio claramente definido?",
      help: "Un producto/servicio con un precio y un cliente claro.",
      type: "single",
      options: [
        { label: "Todavía no lo tengo definido", value: "no", points: 0 },
        { label: "Más o menos, lo estoy afinando", value: "parcial", points: 1 },
        { label: "Sí, está claro y lo vendo", value: "si", points: 2 },
      ],
    },
    {
      key: "presencia",
      question: "¿Tenés presencia digital activa (Instagram, web, etc.)?",
      help: "Un canal donde tu cliente ya te puede encontrar.",
      type: "single",
      options: [
        { label: "No, casi no tengo presencia", value: "no", points: 0 },
        { label: "Tengo, pero está descuidada", value: "parcial", points: 1 },
        { label: "Sí, activa y con movimiento", value: "si", points: 2 },
      ],
    },
    {
      key: "canal",
      question: "¿Tenés una forma clara de vender o cobrar?",
      help: "Un restaurante fisico, dark kitchen, tienda online, WhatsApp de ventas, medios de pago, etc.",
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
        { label: "Puedo empezar con algo chico", value: "chico", points: 1 },
        { label: "Sí, tengo presupuesto asignado", value: "si", points: 2 },
      ],
    },
    {
      key: "dolor",
      question: "¿Cuál es tu mayor problema hoy?",
      help: "Elegí el que más te pese. Esto nos ayuda a personalizar tu recomendación.",
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
      help: "Dejanos tus datos para mandarte el resultado y los próximos pasos.",
      type: "contact",
      fields: [
        { name: "nombre", label: "Tu nombre", input: "text", required: true, placeholder: "Nombre" },
        { name: "email", label: "Email", input: "email", required: true, placeholder: "tucorreo@email.com" },
        { name: "negocio", label: "Nombre del negocio (opcional)", input: "text", required: false, placeholder: "Mi negocio" },
      ],
    },
  ];

  // convertir value de respuetas en mensajes personalizados, que luego llamamos en finish()
  const DOLOR_TIP = {
    clientes: "conseguir clientes de forma más previsible",
    finanzas: "ordenar costos y precios para que te queden ganancias",
    marca:    "que tu marca comunique con claridad quién sos",
    orden:    "poner un sistema para dejar de trabajar sin organización",
    escalar:  "escalar lo que ya funciona con publicidad",
  };

 
  const answers = {};
  let current = 0;

  const form = document.getElementById("diag-form");
  const resultado = document.getElementById("resultado");
  const progressBar = document.getElementById("progress-bar");
  const progressLabel = document.getElementById("progress-label");
  const progressCount = document.getElementById("progress-count");
  const progressWrap = document.getElementById("progress-wrap");

  //  Funcion cada vez que el usuario avanza o retrocede 
  function renderStep(i) {
    const step = STEPS[i];
    let inner = "";

    inner += `<div class="animate-[fadeIn_.3s_ease]">`;
    inner += `<h3 class="font-display text-2xl font-600 tracking-tight">${step.question}</h3>`;
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
              <span class="font-500">${opt.label}</span>
            </span>
          </button>`;
      });
      inner += `</div>`;
    }

    if (step.type === "contact") {
      inner += `<div class="mt-6 space-y-4">`;
      step.fields.forEach((f) => {
        const val = (answers[step.key] && answers[step.key][f.name]) || "";
        inner += `
          <div>
            <label class="block text-sm font-600 mb-1.5">${f.label}${f.required ? ' <span class="text-clay">*</span>' : ""}</label>
            <input type="${f.input}" name="${f.name}" value="${val}" placeholder="${f.placeholder}" ${f.required ? "required" : ""}
              class="w-full rounded-xl border-2 border-sand focus:border-clay focus:ring-0 px-4 py-3 outline-none transition-colors" />
          </div>`;
      });
      inner += `<p id="contact-error" class="hidden text-sm text-clay-dark font-600"></p>`;
      inner += `</div>`;
    }

    inner += `</div>`;

    // Navegación boton atras - siguiente
    inner += `<div class="mt-8 flex items-center justify-between gap-3">`;
    inner += i > 0
      ? `<button type="button" id="btn-back" class="text-ink-soft font-600 hover:text-ink transition-colors inline-flex items-center gap-1">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12"/></svg>
           Atrás</button>`
      : `<span></span>`;

    const isLast = i === STEPS.length - 1;
    inner += `<button type="button" id="btn-next"
      class="rounded-full bg-ink hover:bg-ink-soft text-cream font-600 px-7 py-3 transition-colors inline-flex items-center gap-2">
      ${isLast ? "Ver mi diagnóstico" : "Siguiente"}
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </button>`;
    inner += `</div>`;

    form.innerHTML = inner;
    updateProgress(i);
    wireStep(step, i);
  }

  /* -------------------- Interacción de un paso -------------------- */
  function wireStep(step, i) {
    if (step.type === "single") {
      form.querySelectorAll(".opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          answers[step.key] = {
            value: btn.dataset.value,
            points: Number(btn.dataset.points),
          };
          // feedback visual + auto-avance suave
          renderStep(i);
        });
      });
    }

    const back = document.getElementById("btn-back");
    if (back) back.addEventListener("click", goPrev);

    const next = document.getElementById("btn-next");
    if (next) next.addEventListener("click", goNext);
  }

  /* -------------------- Navegación -------------------- */
  function goNext() {
    const step = STEPS[current];

    // Validación
    if (step.type === "single" && !answers[step.key]) {
      flashError("Elegí una opción para continuar."); // aca se guarda el texto pero mas adelante lo incorporamos al HTML si el usuario no elige una opcion. 
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
        if (err) { err.textContent = "Completá tu nombre y un email válido."; err.classList.remove("hidden"); }
        return;
      }
      answers[step.key] = data;
    }

    if (current < STEPS.length - 1) {
      current++;
      renderStep(current);
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
      el.className = "mt-4 text-sm text-clay-dark font-600";
      form.appendChild(el);
    }
    el.textContent = msg;
  }

  /* -------------------- Progreso -------------------- */
  function updateProgress(i) {
    const pct = Math.round((i / (STEPS.length - 1)) * 100);
    progressBar.style.width = pct + "%";
    progressLabel.textContent = "Paso " + (i + 1);
    progressCount.textContent = (i + 1) + " de " + STEPS.length;
  }

  function scrollToForm() {
    document.getElementById("diagnostico").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* -------------------- Clasificación -------------------- */
  function clasificar() {
    // Puntaje de "preparación" (readiness), sin contar el dolor.
    let score = 0;
    ["etapa", "oferta", "presencia", "canal", "inversion"].forEach((k) => {
      if (answers[k]) score += answers[k].points;
    });
    // Máximo posible = 2+2+2+1+2 = 9
    const inversion = answers.inversion ? answers.inversion.value : "no";
    const dolor = answers.dolor ? answers.dolor.value : "";

    // Regla: para "escalar" hace falta estar dispuesto a invertir
    // y tener bases razonables (score alto).
    const dispuestoAInvertir = inversion === "chico" || inversion === "si";
    const categoria = dispuestoAInvertir && score >= 6 ? "escalar" : "bases";

    return { categoria, score, dolor, inversion };
  }

  /* -------------------- Resultado -------------------- */
  function finish() {
    const { categoria, score, dolor } = clasificar();
    const nombre = (answers.contacto && answers.contacto.nombre) ? answers.contacto.nombre.split(" ")[0] : "";
    const tip = DOLOR_TIP[dolor] || "dar el próximo paso con claridad";

    form.classList.add("hidden");
    progressWrap.classList.add("hidden");
    resultado.classList.remove("hidden");

    let html = "";

    if (categoria === "bases") {
      html = `
        <div class="text-center">
          <span class="inline-flex items-center gap-2 rounded-full bg-sage/10 text-sage-dark text-xs font-700 uppercase tracking-wider px-3 py-1.5">
            Categoría 1 · Bases primero
          </span>
          <h3 class="font-display text-3xl font-600 tracking-tight mt-4">
            ${nombre ? nombre + ", t" : "T"}odavía no es momento de pautar — y está perfecto.
          </h3>
          <p class="mt-4 text-ink-soft text-lg max-w-xl mx-auto">
            Poner plata en Meta Ads ahora sería tirar presupuesto. Primero conviene ordenar bases:
            así cuando pautes, cada peso rinde. Te podemos ayudar a <strong class="text-ink">${tip}</strong>
            con herramientas gratuitas y consultoría puntual.
          </p>
        </div>
        <div class="mt-8 grid sm:grid-cols-3 gap-3 text-left">
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-600">Diagnóstico honesto</p><p class="text-sm text-ink-soft mt-1">Qué te falta y en qué orden resolverlo.</p></div>
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-600">Herramienta gratuita</p><p class="text-sm text-ink-soft mt-1">Un recurso puntual para tu dolor de hoy.</p></div>
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-600">Consultoría puntual</p><p class="text-sm text-ink-soft mt-1">Una sesión enfocada, sin comprometerte a más.</p></div>
        </div>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:infolamesalab@gmail.com?subject=Quiero%20mi%20herramienta%20gratuita" class="rounded-full bg-clay hover:bg-clay-dark text-white font-600 px-7 py-3.5 text-center transition-colors">Quiero mi herramienta gratuita</a>
          <button type="button" id="btn-reset" class="rounded-full border border-ink/20 hover:border-ink font-600 px-7 py-3.5 transition-colors">Volver a empezar</button>
        </div>`;
    } else {
      html = `
        <div class="text-center">
          <span class="inline-flex items-center gap-2 rounded-full bg-clay/10 text-clay-dark text-xs font-700 uppercase tracking-wider px-3 py-1.5">
            Categoría 2 · Listo para escalar
          </span>
          <h3 class="font-display text-3xl font-600 tracking-tight mt-4">
            ${nombre ? "¡" + nombre + ", e" : "E"}stás en condiciones de escalar con publicidad!
          </h3>
          <p class="mt-4 text-ink-soft text-lg max-w-xl mx-auto">
            Tenés las bases y estás dispuesto a invertir. Es el momento de armar una estrategia integral
            —oferta, mensaje, embudo y campañas de Meta Ads— para <strong class="text-ink">${tip}</strong> con números claros.
          </p>
        </div>
        <div class="mt-8 grid sm:grid-cols-3 gap-3 text-left">
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-600">Estrategia integral</p><p class="text-sm text-ink-soft mt-1">Del posicionamiento a la campaña, todo conectado.</p></div>
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-600">Campañas Meta Ads</p><p class="text-sm text-ink-soft mt-1">Estructura, creativos y optimización con datos.</p></div>
          <div class="rounded-xl bg-sand/60 p-4"><p class="font-600">Métricas claras</p><p class="text-sm text-ink-soft mt-1">Saber qué funciona y cuánto te deja.</p></div>
        </div>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:infolamesalab@gmail.com?subject=Quiero%20escalar%20con%20publicidad" class="rounded-full bg-ink hover:bg-ink-soft text-cream font-600 px-7 py-3.5 text-center transition-colors">Agendar una llamada</a>
          <button type="button" id="btn-reset" class="rounded-full border border-ink/20 hover:border-ink font-600 px-7 py-3.5 transition-colors">Volver a empezar</button>
        </div>`;
    }

    // Resumen de respuestas (útil para depurar / integrar con backend)
    html += `
      <details class="mt-8 text-sm text-ink-soft/80">
        <summary class="cursor-pointer font-600 hover:text-ink">Ver resumen de tus respuestas</summary>
        <div class="mt-3 rounded-xl bg-sand/50 p-4 font-mono text-xs leading-relaxed">
          ${resumenTexto(categoria, score)}
        </div>
      </details>`;

    resultado.innerHTML = html;

    const reset = document.getElementById("btn-reset");
    if (reset) reset.addEventListener("click", resetForm);

    scrollToForm();

    // Punto de integración: acá enviarías 'answers' + categoria a tu backend / Google Sheets / email.
    // Ejemplo:
    // fetch('/api/lead', { method:'POST', headers:{'Content-Type':'application/json'},
    //   body: JSON.stringify({ ...answers, categoria, score }) });
    // ---- Enviar el lead por email (Web3Forms) ----
    enviarLead(categoria, score);
  }
  
  /* -------------------- Envío del lead por email -------------------- */
  function enviarLead(categoria, score) {
    const labelDe = (key) => {
      if (!answers[key]) return "(sin responder)";
      const s = STEPS.find((st) => st.key === key);
      const opt = s.options.find((o) => o.value === answers[key].value);
      return opt ? opt.label : answers[key].value;
    };
    const c = answers.contacto || {};
    const payload = {
      access_key: "39d57920-4999-4435-bfd0-e0dff4cf7f6a",
      subject: "Nuevo diagnóstico lamesalab · " +
        (categoria === "escalar" ? "Categoría 2 (Escalar)" : "Categoría 1 (Bases)"),
      from_name: "Formulario lamesalab",
      replyto: c.email || "",
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
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => console.log("[lamesalab] Lead enviado:", data.success))
      .catch((err) => console.error("[lamesalab] Error al enviar lead:", err));
  }

  function resumenTexto(categoria, score) {
    const map = {
      etapa: "Etapa", oferta: "Oferta", presencia: "Presencia",
      canal: "Canal de venta", inversion: "Inversión", dolor: "Dolor principal",
    };
    let out = `categoria: ${categoria} · readiness: ${score}/9<br>`;
    Object.keys(map).forEach((k) => {
      if (!answers[k]) return;
      const step = STEPS.find((s) => s.key === k);
      const opt = step.options.find((o) => o.value === answers[k].value);
      out += `${map[k]}: ${opt ? opt.label : answers[k].value}<br>`;
    });
    if (answers.contacto) {
      out += `Contacto: ${answers.contacto.nombre} · ${answers.contacto.email}`;
      if (answers.contacto.negocio) out += ` · ${answers.contacto.negocio}`;
    }
    return out;
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

  /* -------------------- Init -------------------- */
  renderStep(0);
})();