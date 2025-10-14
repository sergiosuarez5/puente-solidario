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
