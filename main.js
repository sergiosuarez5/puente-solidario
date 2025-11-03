let fundaciones = []; // array vacío que se llenará desde backend en data -> fundaciones.json 
const API_URL = "https://puente-backend-production.up.railway.app/api/fundaciones"; 

// ----------------------
// Paginación para cambiar de sección con las flechas
// ----------------------
let currentPage = 0;
const itemsPerPage = 6;

function renderFundaciones() {
  const container = document.getElementById("fundacionesContainer");
  container.innerHTML = "";

  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const visibles = fundaciones.slice(start, end);

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

  document.getElementById("prevBtn").disabled = currentPage === 0;
  document.getElementById("nextBtn").disabled = (currentPage + 1) * itemsPerPage >= fundaciones.length;
}

// ----------------------
// Toggle funcion para el boton de la card Ver más / Ver menos
// ----------------------
function toggleCard(button) {
  const card = button.closest('.card');
  const botones = card.querySelectorAll('.btn-toggle');
  card.classList.toggle('show-info');

  const mostrarInfo = card.classList.contains('show-info');
  botones.forEach(boton => {
    boton.innerHTML = mostrarInfo
      ? 'Ver menos <i class="bi bi-caret-up-fill"></i>'
      : 'Ver más <i class="bi bi-caret-down-fill"></i>';
  });
}

// ----------------------
// Cargar fundaciones desde la API con manejo de errores
// ----------------------
async function cargarFundaciones() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener fundaciones');
    const data = await res.json();
    fundaciones = data;
    currentPage = 0; 
    renderFundaciones();
  } catch (err) {
    console.error("No se pudieron cargar fundaciones desde API:", err);
  }
}

// ----------------------
// Obtener datos del formulario y manejar su envío
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("webToLeadForm");
  if (!form) return console.warn("⚠️ No se encontró el formulario");
  cargarFundaciones();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("first_name").value || "SIN NOMBRE";
    const descripcion = document.getElementById("description").value || "Sin descripción.";
    const imagen = document.getElementById("imageUrl").value || "./assets/img/fundacion7.jpg";

    const nuevaFundacion = {
      nombre: nombre.toUpperCase(),
      descripcion,
      imagen,
      link: "./page/donaciones.html"
    };

    try {
      const postPromise = fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaFundacion)
      }).then(r => r.json());

      const timeout = new Promise(resolve => setTimeout(() => resolve(null), 2000));
      const resultado = await Promise.race([postPromise, timeout]);

      if (resultado) console.log('Guardado en API:', resultado);
      else console.warn('No se pudo guardar en API (o tardó demasiado).');

    } catch (err) {
      console.error("Error al guardar fundación:", err);
    }

    fundaciones.unshift(nuevaFundacion);
    currentPage = 0;
    renderFundaciones();

    // Enviar a Salesforce después de haberse guardado localmente los datos
    setTimeout(() => form.submit(), 300);
  });

  // Flechas de paginación
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
});







