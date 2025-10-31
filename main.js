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
  const icon = button.querySelector('i');

  // Alternar clase show-info
  card.classList.toggle('show-info');

  // Cambiar texto del botón
  if (card.classList.contains('show-info')) {
    button.innerHTML = 'Ver menos <i class="bi bi-caret-up-fill"></i>';
  } else {
    button.innerHTML = 'Ver más <i class="bi bi-caret-down-fill"></i>';
  }
}