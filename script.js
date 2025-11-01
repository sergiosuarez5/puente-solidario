document.addEventListener('DOMContentLoaded', function() {
    // 1. Obtener referencias principales
    const toggleButton = document.getElementById('chatbot-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatHeader = chatWindow.querySelector('.chat-header');
    
    // 🆕 Referencias clave para el chat
    const chatBody = chatWindow.querySelector('.chat-body'); // Historial del chat
    const messageInput = document.getElementById('chat-message-input');
    const sendButton = document.getElementById('send-btn');
    
    // ⚠️ CRÍTICO: Asegúrate de que el span de error existe en el HTML con este ID.
    const errorMessage = chatWindow.querySelector('#chat-error-message'); 

    // --- CÓDIGO DE INICIALIZACIÓN (Botón de Cerrar) ---
    const closeButton = document.createElement('button');
    closeButton.id = 'chat-close-btn'; 
    closeButton.innerHTML = '-'; 
    closeButton.title = 'Minimizar'; 

    if (chatHeader) {
        chatHeader.appendChild(closeButton);
    }
    
    // 2. Función para alternar la visibilidad
    function toggleChatWindow() {
        if (chatWindow.classList.contains('hidden')) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('visible');
        } else {
            chatWindow.classList.remove('visible');
            chatWindow.classList.add('hidden');
            // Opcional: Ocultar el error al cerrar la ventana
            if (errorMessage) {
                    errorMessage.classList.add('hidden-error');
            }
        }
    }
    
    // 🆕 3. Función auxiliar para añadir mensajes al historial
    function addMessage(sender, text) {
        // 1. Crear el contenedor del mensaje
        const messageDiv = document.createElement('div');
        // Asignar clase de estilo: 'user-message' o 'bot-message'
        messageDiv.classList.add('chat-message', `${sender}-message`);
        
        // 2. Crear el contenido del mensaje
        const content = document.createElement('p');
        content.textContent = text;
        
        // 3. Insertar el contenido y el contenedor en el chat
        messageDiv.appendChild(content);
        chatBody.appendChild(messageDiv);
        
        // 4. Hacer scroll al final
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 🆕 4. Simulación de respuesta de PUENTI
    function simulateBotResponse(userMessage) {
        // Simulación simple. Aquí podrías integrar lógica más compleja.
        const botResponse = "Gracias por tu consulta. He registrado tu mensaje. Si queres saber más sobre donaciones, escribe 'Donar'.";
        
        // Simular un tiempo de respuesta de 800ms
        setTimeout(() => {
            addMessage('bot', botResponse);
        }, 800); 
    }

    // 5. Función de Manejo de Envío de Mensajes (con validación integrada)
    function handleMessageSend() {
        // Ocultar el mensaje de error al inicio de cada intento de envío
        if (errorMessage) {
            errorMessage.classList.add('hidden-error');
        }

        const userMessage = messageInput.value.trim();

        // VALIDACIÓN CLAVE: Si el mensaje está vacío
        if (userMessage === '') {
            if (errorMessage) {
                errorMessage.classList.remove('hidden-error'); // Mostrar el mensaje de error
            }
            messageInput.focus();
            return; // Detenemos la función aquí
        }

        // 1. Mostrar el mensaje del usuario
        addMessage('user', userMessage);

        // 2. Simular respuesta del bot
        simulateBotResponse(userMessage);
        
        // 3. Limpiar el input
        messageInput.value = '';
    }
    
    // 6. Asignar los eventos
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleChatWindow);
    }
    if (closeButton) {
        closeButton.addEventListener('click', toggleChatWindow);
    }
    if (sendButton) {
        sendButton.addEventListener('click', handleMessageSend);
    }
    if (messageInput) {
        messageInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                handleMessageSend(); 
            }
        });
        
        // Opcional: Ocultar el error si el usuario empieza a escribir
        messageInput.addEventListener('input', function() {
            if (errorMessage) {
                errorMessage.classList.add('hidden-error');
            }
        });
    }
});