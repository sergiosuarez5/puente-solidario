document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const form = event.target;
    const data = new FormData(form);

    fetch(form.action, {
        method: "POST",
        body: data,
        mode: "no-cors" 

    }).then(() => {
        document.getElementById("mensaje-exito").style.display = "block";
        form.reset();

    }).catch(err => {
        alert("Ocurrió un error al enviar tu solicitud. Intenta de nuevo.");
        console.error(err);
    });
});

function toggleCard(button) {
  const card = button.closest('.card');
  const botones = card.querySelectorAll('.btn-toggle');
  card.classList.toggle('show-info');

  const mostrarInfo = card.classList.contains('show-info');

  botones.forEach(boton => {
    if (mostrarInfo) {
      boton.innerHTML = 'Ver menos <i class="bi bi-caret-up-fill"></i>';
    } else {
      boton.innerHTML = 'Ver más <i class="bi bi-caret-down-fill"></i>';
    }
  });
}

// Datos de fundaciones
const fundaciones = [
  {
    nombre: "FUNDACIÓN ESPERANZA",
    imagen: "./assets/img/abrazo.jpg",
    descripcion: "Apoyamos a comunidades vulnerables. Entregamos alimentos y suministros. Fomentamos la solidaridad y el bienestar social.",
    link: "./page/donaciones.html"
  },
  {
    nombre: "FUNDACIÓN VIDA",
    imagen: "./assets/img/fundacion7.jpg",
    descripcion: "Promovemos la salud y el bienestar. Distribuimos ayuda esencial. Nuestro foco es la calidad de vida y el soporte vital.",
    link: "./page/donaciones.html"
  },
  {
    nombre: "FUNDACIÓN FUTURO",
    imagen: "./assets/img/fundacion6.jpg",
    descripcion: "Invertimos en la educación de jóvenes. Creamos oportunidades. Aseguramos un mañana mejor.",
    link: "./page/donaciones.html"
  },
  {
    nombre: "FUNDACIÓN LUZ",
    imagen: "./assets/img/fundacion3.jpg",
    descripcion: "Trabajamos por un mundo más justo e inclusivo. Ofrecemos apoyo a personas mayores. Combatimos la marginación y la soledad.",
    link: "./page/donaciones.html"
  },
  {
    nombre: "FUNDACIÓN SEMILLAS",
    imagen: "./assets/img/fundacion1.jpg",
    descripcion: "Impulsamos proyectos de desarrollo sostenible. Entregamos ayuda directa en calles. Promovemos el cambio ambiental y social.",
    link: "./page/donaciones.html"
  },
  {
    nombre: "FUNDACIÓN HOGAR",
    imagen: "./assets/img/fundacion4.jpg",
    descripcion: "Brindamos apoyo a familias sin techo. Ofrecemos refugio y seguridad. Donamos cajas de ayuda. Nuestra meta es el hogar.",
    link: "./page/donaciones.html"
  }
];
console.log("📦 Script fundaciones cargado"); // Para saber si el JS se está ejecutando

const container = document.getElementById("fundacionesContainer");
let currentPage = 0;
const itemsPerPage = 6;

function renderFundaciones() {
  console.log("🔄 renderFundaciones() ejecutado");
  console.log("Total de fundaciones:", fundaciones.length);

  container.innerHTML = ""; // Limpiar
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const visibles = fundaciones.slice(start, end);

  console.log("Mostrando fundaciones del", start, "al", end, visibles);

  visibles.forEach(f => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
      <div class="card h-100 shadow-sm text-center">
        <img src="${f.imagen}" class="card-img-top" alt="${f.nombre}">
        <div class="card-body">
          <h5 class="card-title">${f.nombre}</h5>
          <button class="btn-toggle" onclick="toggleCard(this)">
            Ver más <i class="bi bi-caret-down-fill"></i>
          </button>
          <div class="card-overlay">
            <p>${f.descripcion}</p>
            <a href="${f.link}" class="btn btn-primary text-white">
              DONÁ ACÁ <i class="bi bi-suit-heart-fill"></i>
            </a>
            <button class="btn-toggle" onclick="toggleCard(this)">
              Ver menos <i class="bi bi-caret-up-fill"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderFundaciones();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if ((currentPage + 1) * itemsPerPage < fundaciones.length) {
    currentPage++;
    renderFundaciones();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌐 DOMContentLoaded activado");

  // ✅ Recuperar fundaciones extra guardadas
  const guardadas = JSON.parse(localStorage.getItem("fundacionesExtra")) || [];
  console.log("📂 Fundaciones guardadas recuperadas:", guardadas);

  fundaciones.push(...guardadas);
  console.log("📊 Total tras combinar:", fundaciones.length);

  // ✅ Renderizar fundaciones (con las guardadas incluidas)
  renderFundaciones();

  // ✅ Manejo del formulario
  const form = document.getElementById("webToLeadForm");

  if (!form) {
    console.warn("⚠️ No se encontró el formulario con id 'webToLeadForm'");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita envío inmediato
    console.log("📝 Evento submit detectado");

    const nombre = document.getElementById("first_name").value;
    const descripcion = document.getElementById("description").value || "Sin descripción disponible.";
    const imagen = document.getElementById("imageUrl").value || "./assets/img/fundacion7.jpg";

    console.log("📩 Datos capturados:", { nombre, descripcion, imagen });

    const nuevaFundacion = {
      nombre: nombre.toUpperCase(),
      imagen: imagen,
      descripcion: descripcion,
      link: "./page/donaciones.html"
    };

    console.log("✅ Nueva fundación creada:", nuevaFundacion);

    const guardadas = JSON.parse(localStorage.getItem("fundacionesExtra")) || [];
    guardadas.push(nuevaFundacion);
    localStorage.setItem("fundacionesExtra", JSON.stringify(guardadas));

    console.log("💾 Fundaciones guardadas en localStorage:", guardadas);

    // Esperar un poco y luego enviar a Salesforce
    setTimeout(() => {
      console.log("🚀 Enviando formulario a Salesforce...");
      form.submit();
    }, 300);
  });
});

