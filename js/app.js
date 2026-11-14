//colores de lamesalab para todos los carteles de SweetAlert
const Swal = window.Swal.mixin({
    confirmButtonColor: "#F4320B",
    denyButtonColor: "#3f6b5e",
    cancelButtonColor: "#78716c"
});

const formulario = document.getElementById("form-ingrediente");
const selectUnidadCompra = document.getElementById("unidad-compra");
const selectUnidadReceta = document.getElementById("unidad-receta");
const listaIngredientes = document.getElementById("lista-ingredientes");
const nombreReceta = document.getElementById("nombre-receta");
const porcionesReceta = document.getElementById("porciones-receta");
const foodCostInput = document.getElementById("food-cost");
const resumenNombre = document.getElementById("resumen-nombre");
const panelPrecios = document.getElementById("panel-precios");

//tomamos las unidades que cargamos del JSON y la pasamos al HTML
function llenarSelect(select, listaUnidades){
    select.innerHTML = "";
    listaUnidades.forEach((unidad) => {
        select.innerHTML += `<option value="${unidad.nombre}">${unidad.nombre}</option>`;
    });
}

//muestra en la receta solo las unidades del mismo tipo que la compra
function actualizarUnidadesReceta(){
    const unidadElegida = unidades.find((u) => u.nombre === selectUnidadCompra.value);
    const mismoTipo = unidades.filter((u) => u.tipo === unidadElegida.tipo);
    llenarSelect(selectUnidadReceta, mismoTipo);
}

function mostrarIngredientes(){
    listaIngredientes.innerHTML = ingredientes.length === 0
    ? `<li class="text-gray-500 py-2">Aún no hay ingredientes.</li>` : ""; //revisa si la lista ya esta vacia o sino la vacia para evitar acumulacion de ingredientes en el renderizado

    ingredientes.forEach((ingrediente) => {
        listaIngredientes.innerHTML += `
        <li class="flex items-center justify-between gap-3 py-2">
            <span>
                <strong>${ingrediente.nombre}</strong>: ${ingrediente.cantidadReceta} ${ingrediente.unidadReceta} → ${pesos(calcularCosto(ingrediente))}
            </span>

            <span class="flex gap-2 shrink-0">
                <button class="btn-editar text-sm border border-sage text-sage hover:bg-sage hover:text-white rounded px-2 py-1 transition-colors" data-id="${ingrediente.id}">Editar</button>
                <button class="btn-borrar text-sm bg-clay hover:bg-clay-dark text-white rounded px-2 py-1 transition-colors" data-id="${ingrediente.id}">Borrar</button>
            </span>
        </li>`;
    });

    mostrarPrecios(); //cada cambio en los ingredientes actualiza la card de precios
}

//card del costado: costo, precio sugerido y margen bruto según el food cost
function mostrarPrecios(){
    const { nombre, porciones, foodCost } = datosReceta;
    resumenNombre.textContent = nombre.trim() || "Receta sin nombre";

    if (ingredientes.length === 0){
        panelPrecios.innerHTML = `<p class="text-sm text-gray-500">Agregá ingredientes para ver el precio sugerido.</p>`;
        return;
    }
    if (porciones < 1 || foodCost <= 0 || foodCost >= 100){
        panelPrecios.innerHTML = `<p class="text-sm text-red-600">Revisá las porciones (mínimo 1) y el food cost (entre 1 y 99 %).</p>`;
        return;
    }

    const p = calcularPrecios();
    const fueraDeRango = foodCost < 25 || foodCost > 35;

    panelPrecios.innerHTML = `
        <div class="flex justify-between text-sm">
            <span>Costo de ingredientes</span><strong>${pesos(p.costoTotal)}</strong>
        </div>
        <div class="flex justify-between text-sm">
            <span>Costo por porción</span><strong>${pesos(p.costoPorcion)}</strong>
        </div>

        <div class="rounded-lg bg-sage/10 p-4">
            <p class="text-xs uppercase tracking-wide text-sage font-semibold">Precio por porción</p>
            <p class="text-3xl font-display font-bold">${pesos(p.precioPorcion)}</p>
            <p class="text-xs text-ink-soft/70 mt-1">Margen bruto: ${pesos(p.margenPorcion)}</p>
        </div>

        <div class="rounded-lg bg-clay/10 p-4">
            <p class="text-xs uppercase tracking-wide text-clay font-semibold">Receta completa (${porciones} ${porciones === 1 ? "porción" : "porciones"})</p>
            <p class="text-2xl font-display font-bold">${pesos(p.precioTotal)}</p>
            <p class="text-xs text-ink-soft/70 mt-1">Margen bruto: ${pesos(p.margenTotal)} (${100 - foodCost} %)</p>
        </div>

        <p class="text-xs text-ink-soft/70">El margen bruto todavía tiene que cubrir sueldos, alquiler y servicios.</p>
        ${fueraDeRango ? `<p class="text-xs text-amber-600">⚠️ Food cost fuera del rango habitual (25–35 %).</p>` : ""}
    `;
}

//Agregar Ingrediente
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const precio = Number(document.getElementById("precio").value);
    const cantidadComprada = Number(document.getElementById("cantidad-comprada").value);
    const cantidadReceta = Number(document.getElementById("cantidad-receta").value);

    if (nombre === "" || precio <= 0 || cantidadComprada <= 0 || cantidadReceta <=0){
        Swal.fire("Faltan datos", "Completa todos los campos con valores mayores a 0", "warning");
        return;
    }

    agregarIngrediente({
        nombre,
        precio,
        cantidadComprada,
        unidadCompra: selectUnidadCompra.value,
        cantidadReceta,
        unidadReceta: selectUnidadReceta.value
    });

    //limpiar y actualizar formulario
    formulario.reset();
    actualizarUnidadesReceta();
    mostrarIngredientes(); //redibuja la lista y los precios
    Swal.fire({icon: "success", title: `${nombre} agregado`, timer: 1200, showConfirmButton: false});
});

// editar o borrar desde la lista
listaIngredientes.addEventListener("click", async (evento) => {
    const id = Number(evento.target.dataset.id); //guardamos el id encontrado

    if (evento.target.classList.contains("btn-borrar")){ //si clickeamos en borrar elimina el ingrediente unico y luego se redibuja la lista y los precios
        borrarIngredientes(id);
        mostrarIngredientes();
    }

    if (evento.target.classList.contains("btn-editar")){
        const {value: nuevaCantidad } = await Swal.fire({
            title: "Nueva cantidad en la receta",
            input: "number",
            showCancelButton: true,
        });
        if (nuevaCantidad > 0) {
            modificarCantidad(id, Number(nuevaCantidad));
            mostrarIngredientes();
        }
    }
});

// nombre, porciones y food cost: se guardan y la card de precios se actualiza mientras se escribe
nombreReceta.addEventListener("input", () => {
    datosReceta.nombre = nombreReceta.value;
    guardarDatosReceta();
    mostrarPrecios();
});

porcionesReceta.addEventListener("input", () => {
    datosReceta.porciones = Number(porcionesReceta.value);
    guardarDatosReceta();
    mostrarPrecios();
});

foodCostInput.addEventListener("input", () => {
    datosReceta.foodCost = Number(foodCostInput.value);
    guardarDatosReceta();
    mostrarPrecios();
});

// cuando cambia la unidad de compra, se actualizan las opciones de la receta
selectUnidadCompra.addEventListener("change", actualizarUnidadesReceta);

//deja los inputs de nombre y porciones como quedaron en datosReceta
function reiniciarFormularioReceta(){
    nombreReceta.value = datosReceta.nombre;
    porcionesReceta.value = datosReceta.porciones;
    mostrarIngredientes();
}

// vaciar toda la receta, con confirmación
document.getElementById("vaciar-receta").addEventListener("click", async () => {
    const { isConfirmed } = await Swal.fire({
        title: "¿Vaciar la receta?",
        text: "Se borran el nombre, las porciones y todos los ingredientes.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar",
    });
    if (isConfirmed) {
        vaciarReceta();
        reiniciarFormularioReceta();
    }
});

//copia el texto al portapapeles; devuelve true si salió bien
async function copiarTexto(texto){
    try {
        await navigator.clipboard.writeText(texto);
        return true;
    } catch (error) {
        //plan B para navegadores que bloquean el portapapeles: copiar desde un textarea oculto
        const area = document.createElement("textarea");
        area.value = texto;
        Swal.getPopup().appendChild(area); //adentro del cartel, porque SweetAlert no deja seleccionar afuera
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        return ok;
    }
}

//abre el menú de compartir del dispositivo, o WhatsApp si el navegador no lo tiene
async function compartirTexto(titulo, texto){
    if (navigator.share) {
        try {
            await navigator.share({ title: titulo, text: texto });
        } catch (error) {
            //el usuario cerró el menú de compartir sin elegir nada
        }
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
    }
}

// confirmar receta: valida, la guarda y ofrece copiarla o compartirla
document.getElementById("btn-confirmar").addEventListener("click", async () => {
    const { nombre, porciones, foodCost } = datosReceta;

    if (ingredientes.length === 0) {
        Swal.fire("Receta vacía", "Agregá al menos un ingrediente antes de confirmar.", "info");
        return;
    }
    if (nombre.trim() === "" || porciones < 1) {
        Swal.fire("Faltan datos", "Completá el nombre de la receta y cuántas porciones rinde.", "warning");
        nombreReceta.focus();
        return;
    }
    if (foodCost <= 0 || foodCost >= 100) {
        Swal.fire("Food cost inválido", "Poné un food cost entre 1 y 99 %.", "warning");
        foodCostInput.focus();
        return;
    }

    guardarReceta();
    const texto = textoReceta();

    //Copiar y Compartir trabajan en el mismo clic (si no, el navegador bloquea el portapapeles)
    //y devuelven false para que el cartel quede abierto y se puedan usar los dos
    await Swal.fire({
        title: "Receta guardada",
        icon: "success",
        html: `<pre style="text-align:left; white-space:pre-wrap; font-family:inherit; font-size:.9rem; background:#f9fafb; padding:1rem; border-radius:.5rem">${texto}</pre>`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Copiar",
        denyButtonText: "Compartir",
        cancelButtonText: "Cerrar",
        preConfirm: async () => {
            const ok = await copiarTexto(texto);
            Swal.getConfirmButton().textContent = ok ? "¡Copiada! ✓" : "No se pudo copiar";
            return false;
        },
        preDeny: async () => {
            await compartirTexto(nombre, texto);
            return false;
        }
    });

    //la receta ya quedó guardada: dejamos la calculadora lista para la próxima
    vaciarReceta();
    reiniciarFormularioReceta();
});

// arranque: primero las unidades, después todo lo demás
async function iniciar() {
    nombreReceta.value = datosReceta.nombre;
    porcionesReceta.value = datosReceta.porciones;
    foodCostInput.value = datosReceta.foodCost;

    const ok = await cargarUnidades();
    if (!ok) return;
    llenarSelect(selectUnidadCompra, unidades);
    actualizarUnidadesReceta();
    mostrarIngredientes();
}

iniciar();