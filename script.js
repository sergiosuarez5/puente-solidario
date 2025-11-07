document.addEventListener('DOMContentLoaded', function() {
    // 1. Obtener referencias principales
    const toggleButton = document.getElementById('chatbot-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatHeader = chatWindow.querySelector('.chat-header');
    
    // 🆕 Referencias clave para el chat
    const chatBody = chatWindow.querySelector('.chat-body'); // Historial del chat
    const messageInput = document.getElementById('chat-message-input');
    const sendButton = document.getElementById('send-btn');
    const errorMessage = chatWindow.querySelector('#chat-error-message'); 

    // 🆕 Estado del Chat para manejar las etapas del menú
    // Nuevo estado: 'waiting_for_name'
    let chatState = 'initial'; 
    // ⚠️ Nueva variable para almacenar el nombre del usuario
    let userName = null; 

    // 🆕 URLs/IDs de Destino (¡CONFIGURACIÓN FINAL!)
    // URL_DONACION: Apunta al archivo donaciones.html sin anclaje, según solicitaste.
    const URL_DONACION = 'page/donaciones.html'; 
    // ID_FUNDACION: Asumiendo que 'donar' es el ID de la sección de fundación
    const ID_FUNDACION = 'donar'; 
    
    // --- CÓDIGO DE INICIALIZACIÓN (Botón de Cerrar) ---
    const closeButton = document.createElement('button');
    closeButton.id = 'chat-close-btn'; 
    closeButton.innerHTML = '-'; 
    closeButton.title = 'Minimizar'; 

    if (chatHeader) {
        chatHeader.appendChild(closeButton);
    }
    
    // ------------------------------------------------------------------
    // 2. Función para alternar la visibilidad
    function toggleChatWindow() {
        if (chatWindow.classList.contains('hidden')) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('visible');
            
            // Mostrar el mensaje inicial solo si el chat se abre por primera vez
            if (chatState === 'initial') {
                setTimeout(() => {
                    displayInitialMessage();
                }, 300); // Pequeño retraso para que la ventana se abra primero
            }
        } else {
            chatWindow.classList.remove('visible');
            chatWindow.classList.add('hidden');
            if (errorMessage) {
                errorMessage.classList.add('hidden-error');
            }
        }
    }
    
    // ------------------------------------------------------------------
    // 3. Función auxiliar para añadir mensajes de TEXTO (Usuario y Bot)
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        
        // ⚠️ MODIFICACIÓN: Creamos el label del nombre para el usuario
        if (sender === 'user' && userName) {
            const nameLabel = document.createElement('div');
            nameLabel.textContent = userName.toUpperCase(); 
            nameLabel.classList.add('user-label'); 
            messageDiv.classList.add('user-message-custom'); // Clase auxiliar para CSS
            messageDiv.appendChild(nameLabel);
        }

        // El contenido del párrafo usa <br> para los saltos de línea del menú
        const content = document.createElement('p');
        content.innerHTML = text.replace(/\n/g, '<br>'); 
        
        // El párrafo debe ir antes o después del label según el diseño (va antes aquí)
        messageDiv.insertBefore(content, messageDiv.firstChild); 
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; 
    }

    // 🆕 Función auxiliar para añadir mensajes con BOTÓN
    function addButtonMessage(text, url, buttonText, isAnchor = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', 'bot-message', 'has-button'); 
        
        const content = document.createElement('p');
        content.textContent = text;
        
        const button = document.createElement('a');
        button.textContent = buttonText;
        button.classList.add('chat-button');
        
        if (isAnchor) {
            // Lógica de anclaje interno (Fundación)
            button.href = '#' + url; 
            button.onclick = function() {
                chatWindow.classList.remove('visible');
                chatWindow.classList.add('hidden');
            };
        } else {
            // Lógica de URL externa / Otro HTML (Donación)
            button.href = url; 
            button.target = '_blank'; 
        }
        messageDiv.appendChild(content);
        messageDiv.appendChild(button);
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // ------------------------------------------------------------------
    // 🆕 4. Mensaje inicial de PUENTI
    function displayInitialMessage() {
        if (userName === null) {
            // Pregunta el nombre
            const initialText = "¡Hola soy PUENTI Bienvenid@! Para comenzar, ¿Cuál es tu nombre?";
            addMessage('bot', initialText);
            chatState = 'waiting_for_name'; // Nuevo estado
        } else {
            // Muestra el menú con el nombre
            const initialText = `¡Hola ${userName}! estoy para ofrecerte ayuda! Eligí una opción: \n1. Quiero Donar\n2. Soy Fundación`;
            addMessage('bot', initialText);
            chatState = 'waiting_for_option'; 
        }
    }
    
    // ------------------------------------------------------------------
    // 5. Lógica de Respuestas y Estados del Menú
    function simulateBotResponse(userMessage) {
        const msgLower = userMessage.toLowerCase().trim();

        setTimeout(() => {
            // ⚠️ ESTADO: Esperando el nombre
            if (chatState === 'waiting_for_name') {
                userName = userMessage.split(' ')[0]; // Almacena el primer nombre
                
                // Muestra la bienvenida personalizada y pasa a 'waiting_for_option'
                const response = `¡Perfecto, ${userName}! estoy para ofrecerte ayuda. Por favor, selecciona una opción: \n1. Quiero Donar\n2. Soy Fundación`;
                addMessage('bot', response);
                chatState = 'waiting_for_option';
                return;
            }

            // ESTADO: Esperando Opción del Menú
            if (chatState === 'waiting_for_option') {
                // RESPUESTA A OPCIÓN 1 (Donar)
                if (msgLower === '1' || msgLower.includes('donar')) {
                    const response = "¡Agradecemos tu iniciativa y aporte económico estamos seguros que generará un impacto positivo! Responde “SI” si querés que te guíe en el proceso";
                    addMessage('bot', response);
                    chatState = 'waiting_for_donation_confirm';
                // RESPUESTA A OPCIÓN 2 (Fundación)
                } else if (msgLower === '2' || msgLower.includes('fundacion')) {
                    const response = "¡Agradecemos tu iniciativa de cambiar el mundo con tu propósito de ayudar e impactar vidas Bienvenid@! Responde \"SI\" si queres que te ayude en tu inscripción como Fundación.";
                    addMessage('bot', response);
                    chatState = 'waiting_for_fundacion_confirm';
                } else {
                    addMessage('bot', "No entendí tu consulta. Por favor, seleccioná la opción 1 o 2.");
                }
            
            // ESTADO: Esperando confirmación de Donación
            } else if (chatState === 'waiting_for_donation_confirm') {
                if (msgLower === 'si') {
                    const text = "¡Excelente! Este botón te llevará al formulario de donantes:";
                    addButtonMessage(text, URL_DONACION, 'DONAR AHORA', false); 
                    chatState = 'free_chat';
                }
                
            // ESTADO: Esperando confirmación de Fundación
            } else if (chatState === 'waiting_for_fundacion_confirm') {
                if (msgLower === 'si') {
                    const text = "Acá podes seguir los pasos para inscribirte:";
                    addButtonMessage(text, ID_FUNDACION, 'FORMULARIO FUNDACIONES', true); 
                    chatState = 'free_chat';
                } else {
                    addMessage('bot', "Entendido. Si cambias de opinión, escribe '2' nuevamente para empezar el proceso de inscripción.");
                    chatState = 'waiting_for_option'; 
                }

            // ESTADO: Chat Libre
            } else {
                const genericResponse = "Gracias por tu mensaje. Para volver al menú principal, escribe 'Menú'.";
                addMessage('bot', genericResponse);
                if (msgLower === 'menu' || msgLower === 'menú') {
                    displayInitialMessage();
                }
            }
        }, 800); 
    }

    // 6. Función de Manejo de Envío de Mensajes (con validación integrada)
    function handleMessageSend() {
        if (errorMessage) {
            errorMessage.classList.add('hidden-error');
        }

        const userMessage = messageInput.value.trim();

        if (userMessage === '') {
            if (errorMessage) {
                errorMessage.classList.remove('hidden-error');
            }
            messageInput.focus();
            return;
        }

        // 1. Mostrar el mensaje del usuario
        addMessage('user', userMessage);

        // 2. Ejecutar la lógica de respuestas y estados
        simulateBotResponse(userMessage);
        
        // 3. Limpiar el input
        messageInput.value = '';
    }
    
    // 7. Asignar los eventos (Sin cambios)
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
        
        messageInput.addEventListener('input', function() {
            if (errorMessage) {
                errorMessage.classList.add('hidden-error');
            }
        });
    }
});