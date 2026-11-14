let unidades = []; //empezamos con un array en blanco
let ingredientes = JSON.parse(localStorage.getItem("ingredientes")) || []; //luego revisamos que no hayan datos cargados o sino empezamos con el array de ingredientes en blanco
let recetas = JSON.parse(localStorage.getItem("recetas")) || []; //recetas confirmadas, o empezamos con el array en blanco
//nombre, porciones y food cost (en %) de la receta en curso
let datosReceta = JSON.parse(localStorage.getItem("datosReceta")) || { nombre: "", porciones: 1, foodCost: 30 };

//cargamos unidades de medicion desde el JSON
async function cargarUnidades() {
    try {
        const respuesta = await fetch("/recursos/calculadora-costos/data/unidades.json"); //ruta absoluta: funciona aunque la URL no termine en "/"
        if(!respuesta.ok) throw new Error("Error al cargar unidades");
        unidades = await respuesta.json();
        return true;
    } catch (error){
        Swal.fire("Error", "No se pudieron cargar las unidades. Intenta más tarde.", "error");
        return false;
    } finally {
        document.getElementById("cargando").style.display = "none";
    }
}

// covertir cualquier unidad a su base ya sean: gramos, ml o por unidad)
function convertirAUnidadBase(cantidad, nombreUnidad){
    const unidad = unidades.find((u) => u.nombre === nombreUnidad);
    return cantidad * unidad.factor;
}

//cuánto cuesta la cantidad de ese ingrediente que usa la receta
function calcularCosto(ingrediente){
    const {precio, cantidadComprada, unidadCompra, cantidadReceta, unidadReceta} = ingrediente;
    const costoPorUnidadBase = precio / convertirAUnidadBase(cantidadComprada, unidadCompra);
    return costoPorUnidadBase * convertirAUnidadBase(cantidadReceta, unidadReceta);
}

function calcularTotal() {
    return ingredientes.reduce((total, ingrediente) => total + calcularCosto(ingrediente), 0);
}

//precio de venta para que los ingredientes representen cierto % del precio (ej: 0.30 = 30%)
function precioConFoodCost(costo, foodCost){
    return costo / foodCost;
}

//costo, precio sugerido y margen bruto, de la receta completa y por porción
function calcularPrecios(){
    const { porciones, foodCost } = datosReceta;
    const costoTotal = calcularTotal();
    const precioTotal = precioConFoodCost(costoTotal, foodCost / 100); //el usuario escribe 30 → 0.30
    const margenTotal = precioTotal - costoTotal;
    return {
        costoTotal,
        precioTotal,
        margenTotal,
        costoPorcion: costoTotal / porciones,
        precioPorcion: precioTotal / porciones,
        margenPorcion: margenTotal / porciones
    };
}

//formato de plata argentino: 1234.5 → "$1.234,50"
function pesos(numero){
    return "$" + numero.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

//localstorage
function guardarEnStorage(){
    localStorage.setItem("ingredientes", JSON.stringify(ingredientes));
}

function guardarDatosReceta(){
    localStorage.setItem("datosReceta", JSON.stringify(datosReceta));
}

function agregarIngrediente(ingrediente){
    ingrediente.id = Date.now();
    ingredientes.push(ingrediente);
    guardarEnStorage();
}

function modificarCantidad(id, nuevaCantidad){
    const ingrediente = ingredientes.find((i) => i.id === id);
    ingrediente.cantidadReceta = nuevaCantidad;
    guardarEnStorage();
}

function borrarIngredientes(id){
    ingredientes = ingredientes.filter((i) => i.id !== id);
    guardarEnStorage();
}

//guarda una copia de la receta actual con sus costos y precios
function guardarReceta(){
    recetas.push({
        id: Date.now(),
        ...datosReceta,
        ingredientes: [...ingredientes],
        ...calcularPrecios()
    });
    localStorage.setItem("recetas", JSON.stringify(recetas));
}

//borra ingredientes, nombre y porciones; el food cost se mantiene para la próxima receta
function vaciarReceta(){
    ingredientes = [];
    datosReceta.nombre = "";
    datosReceta.porciones = 1;
    localStorage.removeItem("ingredientes"); //borra solo los ingredientes, no las recetas guardadas
    guardarDatosReceta();
}

//arma la receta como texto plano para copiar o compartir
function textoReceta(){
    const { nombre, porciones, foodCost } = datosReceta;
    const p = calcularPrecios();
    const lineas = ingredientes.map((i) =>
        `• ${i.nombre}: ${i.cantidadReceta} ${i.unidadReceta} → ${pesos(calcularCosto(i))}`
    );

    return [
        nombre.toUpperCase(),
        `Rinde: ${porciones} ${porciones === 1 ? "porción" : "porciones"}`,
        "",
        "Ingredientes:",
        ...lineas,
        "",
        `Costo total: ${pesos(p.costoTotal)}`,
        `Costo por porción: ${pesos(p.costoPorcion)}`,
        `Food cost objetivo: ${foodCost} %`,
        "",
        `Precio sugerido por porción: ${pesos(p.precioPorcion)}`,
        `Precio sugerido receta completa: ${pesos(p.precioTotal)}`
    ].join("\n");
}