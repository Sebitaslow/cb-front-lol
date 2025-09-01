import { post } from "../../service/api.js";

const API_BASE = "https://cb-back-p.vercel.app";
const CHAT_ENDPOINT = `${API_BASE}/chat`;

export function initChat() {
  console.log('🚀 Inicializando chat...');
  
  const messagesContainer = document.getElementById('messages');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send-btn');
  const form = document.getElementById('form');

  console.log('🔍 Elementos del chat encontrados:', {
    messagesContainer: !!messagesContainer,
    input: !!input,
    sendBtn: !!sendBtn,
    form: !!form
  });

  if (!messagesContainer || !input || !sendBtn) {
    console.warn('❌ Chat elements not found');
    return;
  }

  // Función para limpiar el chat cuando cambie el video
  function clearChat() {
    messagesContainer.innerHTML = '';
    addMessage('¡Hola! Soy tu asistente de IA especializado en desarrollo de software. ¿En qué puedo ayudarte con este video?', 'bot');
  }

  // Función para escapar HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Función para formatear mensajes del bot
  function formatBotMessage(text) {
    let formattedText = text;
    
    // Detectar bloques de código (texto entre ```)
    formattedText = formattedText.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      return `<div class="code-block">
        <div class="code-header">
          <span class="code-language">${language}</span>
          <button class="copy-btn" onclick="copyCode(this)">📋</button>
        </div>
        <pre class="code-content"><code>${escapeHtml(code.trim())}</code></pre>
      </div>`;
    });
    
    // Detectar código en línea (texto entre `)
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Detectar listas numeradas
    formattedText = formattedText.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    if (formattedText.includes('<li>') && !formattedText.includes('<ol')) {
      formattedText = formattedText.replace(/(<li>.*<\/li>)/s, '<ol class="numbered-list">$1</ol>');
    }
    
    // Detectar listas con viñetas
    formattedText = formattedText.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    if (formattedText.includes('<li>') && !formattedText.includes('<ol')) {
      formattedText = formattedText.replace(/(<li>.*<\/li>)/s, '<ul class="bullet-list">$1</ul>');
    }
    
    // Detectar títulos (líneas que empiezan con #)
    formattedText = formattedText.replace(/^#{1,3}\s+(.+)$/gm, (match, title) => {
      const level = match.match(/^#+/)[0].length;
      return `<h${Math.min(level, 6)} class="message-title">${title}</h${Math.min(level, 6)}>`;
    });
    
    // Detectar texto en negrita (**texto**)
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Detectar texto en cursiva (*texto*)
    formattedText = formattedText.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Convertir saltos de línea en <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  }

  // Función para hacer scroll suave al final del chat
  function smoothScrollToBottom() {
    const scrollOptions = {
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    };
    messagesContainer.scrollTo(scrollOptions);
  }

  // Función para verificar si el usuario está cerca del final del chat
  function isNearBottom() {
    const threshold = 100; // píxeles desde el final
    return messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < threshold;
  }

  // Función para agregar mensajes al chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    
    // Detectar si el texto contiene código o necesita formateo especial
    if (sender === 'bot') {
      // Formatear el texto del bot para código y texto especial
      messageDiv.innerHTML = formatBotMessage(text);
    } else {
      // Mensajes del usuario se mantienen como texto plano
      messageDiv.textContent = text;
    }
    
    // Agregar timestamp
    const timestamp = document.createElement('small');
    timestamp.className = 'message-time';
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timestamp.style.display = 'block';
    timestamp.style.fontSize = '0.75rem';
    timestamp.style.opacity = '0.7';
    timestamp.style.marginTop = '0.25rem';
    
    messageDiv.appendChild(timestamp);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll inteligente: solo hacer scroll si el usuario está cerca del final
    const shouldScroll = isNearBottom();
    
    // Animación de entrada
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    messageDiv.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
      
      // Hacer scroll suave después de la animación si es necesario
      if (shouldScroll) {
        smoothScrollToBottom();
      }
    }, 100);
  }

  // Función para enviar mensaje
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    console.log('📤 Enviando mensaje:', message);

    // Agregar mensaje del usuario
    addMessage(message, 'user');
    
    // Limpiar input
    input.value = '';
    
    // Mostrar indicador de escritura
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'bot-msg typing-indicator';
    typingIndicator.innerHTML = `
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    messagesContainer.appendChild(typingIndicator);
    smoothScrollToBottom();

    try {
      console.log('🌐 Enviando a:', CHAT_ENDPOINT);
      
      // Obtener el videoID del localStorage o usar un valor por defecto
      const currentVideo = JSON.parse(localStorage.getItem('currentVideo')) || {};
      const videoID = currentVideo.id_video || 1; // Valor por defecto si no hay video seleccionado
      
      console.log('🎥 Video ID:', videoID);
      console.log('🎬 Video actual:', currentVideo);
      
      // Enviar mensaje al backend según tu API
      const response = await post(CHAT_ENDPOINT, {
        ask: message,
        videoID: videoID
      });

      console.log('✅ Respuesta del backend:', response);

      // Remover indicador de escritura
      messagesContainer.removeChild(typingIndicator);

      // Procesar respuesta según tu API (devuelve 'responses')
      if (response && response.responses) {
        addMessage(response.responses, 'bot');
      } else if (response && response.message) {
        addMessage(response.message, 'bot');
      } else {
        addMessage('Lo siento, no pude procesar tu mensaje. Inténtalo de nuevo.', 'bot');
      }

    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      // Remover indicador de escritura
      messagesContainer.removeChild(typingIndicator);
      
      // Mensaje de error
      addMessage('Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.', 'bot');
    }
  }

  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // Crear botón de scroll al final
  const scrollToBottomBtn = document.createElement('button');
  scrollToBottomBtn.className = 'scroll-to-bottom-btn';
  scrollToBottomBtn.innerHTML = '⬇️';
  scrollToBottomBtn.title = 'Ir al final del chat';
  scrollToBottomBtn.style.cssText = `
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--color-primary);
    color: white;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  
  // Agregar el botón al contenedor de mensajes
  messagesContainer.style.position = 'relative';
  messagesContainer.appendChild(scrollToBottomBtn);
  
  // Función para mostrar/ocultar el botón de scroll
  function updateScrollButton() {
    const isAtBottom = isNearBottom();
    if (isAtBottom) {
      scrollToBottomBtn.style.opacity = '0';
      scrollToBottomBtn.style.visibility = 'hidden';
    } else {
      scrollToBottomBtn.style.opacity = '1';
      scrollToBottomBtn.style.visibility = 'visible';
    }
  }
  
  // Event listener para el botón de scroll
  scrollToBottomBtn.addEventListener('click', () => {
    smoothScrollToBottom();
  });
  
  // Event listener para detectar scroll manual
  messagesContainer.addEventListener('scroll', updateScrollButton);
  
  // Focus en el input al cargar
  input.focus();

  // Mensaje de bienvenida
  addMessage('¡Hola! Soy tu asistente de IA especializado en desarrollo de software. ¿En qué puedo ayudarte con este video?', 'bot');

  // Escuchar cambios en el localStorage para actualizar el chat cuando cambie el video
  window.addEventListener('storage', (e) => {
    if (e.key === 'currentVideo') {
      console.log('🎬 Video cambiado, limpiando chat...');
      clearChat();
    }
  });

  // También escuchar cambios desde el mismo tab
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    if (key === 'currentVideo') {
      console.log('🎬 Video cambiado desde el mismo tab, limpiando chat...');
      setTimeout(() => clearChat(), 100);
    }
    originalSetItem.apply(this, arguments);
  };

  // Función para copiar código (se expone globalmente)
  window.copyCode = function(button) {
    const codeBlock = button.closest('.code-block');
    const codeContent = codeBlock.querySelector('.code-content code');
    const textToCopy = codeContent.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Cambiar temporalmente el botón para mostrar que se copió
      const originalText = button.textContent;
      button.textContent = '✅';
      button.style.background = '#28a745';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    }).catch(err => {
      console.error('Error copiando código:', err);
      button.textContent = '❌';
      button.style.background = '#dc3545';
      
      setTimeout(() => {
        button.textContent = '📋';
        button.style.background = '';
      }, 2000);
    });
  };

  console.log('✅ Chat inicializado correctamente');
}
