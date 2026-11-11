// Formulario de contacto: revisa los campos y envía los datos a Web3Forms.

const formContacto = document.getElementById("form-contacto");
const errorContacto = document.getElementById("contacto-error");
const graciasContacto = document.getElementById("contacto-gracias");
const botonEnviar = document.getElementById("btn-enviar");

formContacto.addEventListener("submit", function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  // Junta lo que escribió la persona.
  const datos = {
    nombre: formContacto.nombre.value.trim(),
    negocio: formContacto.negocio.value.trim(),
    ubicacion: formContacto.ubicacion.value.trim(),
    medio: formContacto.medio.value,
    contacto: formContacto.contacto.value.trim(),
    horario: formContacto.horario.value,
    mensaje: formContacto.mensaje.value.trim(),
  };

  // Revisa que los obligatorios estén completos.
  if (!datos.nombre || !datos.negocio || !datos.ubicacion || !datos.medio || !datos.contacto || !datos.horario) {
    mostrarError("Completa los campos marcados con *.");
    return;
  }

  // Si eligió Email, revisa que parezca un email.
  const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.contacto);
  if (datos.medio === "Email" && !esEmail) {
    mostrarError("Escribe un email válido.");
    return;
  }

  errorContacto.classList.add("hidden");
  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando...";

  // Lo que llega a tu correo.
  const envio = {
    access_key: "39d57920-4999-4435-bfd0-e0dff4cf7f6a",
    subject: "Nuevo contacto lamesalab · " + datos.negocio,
    from_name: "Formulario de contacto lamesalab",
    Tipo: "Página de contacto",
    Nombre: datos.nombre,
    Negocio: datos.negocio,
    Ubicacion: datos.ubicacion,
    "Medio de contacto": datos.medio,
    Contacto: datos.contacto,
    "Horario para contactar": datos.horario,
    Mensaje: datos.mensaje || "(sin mensaje)",
  };
  if (esEmail) envio.replyto = datos.contacto; // para responder directo desde el correo

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(envio),
  })
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      if (resultado.success) {
        formContacto.classList.add("hidden");
        graciasContacto.classList.remove("hidden");
      } else {
        throw new Error(resultado.message);
      }
    })
    .catch(() => {
      mostrarError("No pudimos enviar tus datos. Prueba de nuevo o escríbenos por WhatsApp.");
      botonEnviar.disabled = false;
      botonEnviar.textContent = "Enviar mis datos";
    });
});

function mostrarError(texto) {
  errorContacto.textContent = texto;
  errorContacto.classList.remove("hidden");
}