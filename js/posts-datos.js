const POSTS = [
  {
    slug: "promocionar-instagram-restaurantes", // será la dirección: sin tildes ni espacios
    titulo: "¿Promocionar en Instagram le trae clientes a un restaurante en 2026?",
    resumen: "Qué medir antes de volver a tocar el botón Promocionar.",
    fecha: "2026-11-08",
    imagen: "/imgs/blog/promocionar.jpeg", // opcional; borra esta línea si no tienes foto
    contenido: [
      "Primer párrafo del artículo.",
      "## Un subtítulo",
      "Otro párrafo.",
    ],
  },
];

if (typeof module !== "undefined") module.exports = POSTS; //para que sea lea con NODE 