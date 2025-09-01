import{p as C}from"./main-B39Fbl4y.js";const x="https://cb-back-p.vercel.app",g=`${x}/chat`;function I(){console.log("🚀 Inicializando chat...");const l=document.getElementById("messages"),c=document.getElementById("input"),r=document.getElementById("send-btn"),y=document.getElementById("form");if(console.log("🔍 Elementos del chat encontrados:",{messagesContainer:!!l,input:!!c,sendBtn:!!r,form:!!y}),!l||!c||!r){console.warn("❌ Chat elements not found");return}function m(){l.innerHTML="",i("¡Hola! Soy tu asistente de IA especializado en desarrollo de software. ¿En qué puedo ayudarte con este video?","bot")}function h(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function v(t){let e=t;return e=e.replace(/```(\w+)?\n([\s\S]*?)```/g,(o,s,n)=>`<div class="code-block">
        <div class="code-header">
          <span class="code-language">${s||"text"}</span>
          <button class="copy-btn" onclick="copyCode(this)">📋</button>
        </div>
        <pre class="code-content"><code>${h(n.trim())}</code></pre>
      </div>`),e=e.replace(/`([^`]+)`/g,'<code class="inline-code">$1</code>'),e=e.replace(/^\d+\.\s+(.+)$/gm,"<li>$1</li>"),e.includes("<li>")&&!e.includes("<ol")&&(e=e.replace(/(<li>.*<\/li>)/s,'<ol class="numbered-list">$1</ol>')),e=e.replace(/^[-*]\s+(.+)$/gm,"<li>$1</li>"),e.includes("<li>")&&!e.includes("<ol")&&(e=e.replace(/(<li>.*<\/li>)/s,'<ul class="bullet-list">$1</ul>')),e=e.replace(/^#{1,3}\s+(.+)$/gm,(o,s)=>{const n=o.match(/^#+/)[0].length;return`<h${Math.min(n,6)} class="message-title">${s}</h${Math.min(n,6)}>`}),e=e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/\*(.+?)\*/g,"<em>$1</em>"),e=e.replace(/\n/g,"<br>"),e}function d(){const t={top:l.scrollHeight,behavior:"smooth"};l.scrollTo(t)}function p(){return l.scrollHeight-l.scrollTop-l.clientHeight<100}function i(t,e){const o=document.createElement("div");o.className=e==="user"?"user-msg":"bot-msg",e==="bot"?o.innerHTML=v(t):o.textContent=t;const s=document.createElement("small");s.className="message-time",s.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),s.style.display="block",s.style.fontSize="0.75rem",s.style.opacity="0.7",s.style.marginTop="0.25rem",o.appendChild(s),l.appendChild(o);const n=p();o.style.opacity="0",o.style.transform="translateY(10px)",o.style.transition="all 0.3s ease",setTimeout(()=>{o.style.opacity="1",o.style.transform="translateY(0)",n&&d()},100)}async function u(){const t=c.value.trim();if(!t)return;console.log("📤 Enviando mensaje:",t),i(t,"user"),c.value="";const e=document.createElement("div");e.className="bot-msg typing-indicator",e.innerHTML=`
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `,l.appendChild(e),d();try{console.log("🌐 Enviando a:",g);const o=JSON.parse(localStorage.getItem("currentVideo"))||{},s=o.id_video||1;console.log("🎥 Video ID:",s),console.log("🎬 Video actual:",o);const n=await C(g,{ask:t,videoID:s});console.log("✅ Respuesta del backend:",n),l.removeChild(e),n&&n.responses?i(n.responses,"bot"):n&&n.message?i(n.message,"bot"):i("Lo siento, no pude procesar tu mensaje. Inténtalo de nuevo.","bot")}catch(o){console.error("❌ Error sending message:",o),l.removeChild(e),i("Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.","bot")}}r.addEventListener("click",u),c.addEventListener("keypress",t=>{t.key==="Enter"&&(t.preventDefault(),u())});const a=document.createElement("button");a.className="scroll-to-bottom-btn",a.innerHTML="⬇️",a.title="Ir al final del chat",a.style.cssText=`
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
  `,l.style.position="relative",l.appendChild(a);function f(){p()?(a.style.opacity="0",a.style.visibility="hidden"):(a.style.opacity="1",a.style.visibility="visible")}a.addEventListener("click",()=>{d()}),l.addEventListener("scroll",f),c.focus(),i("¡Hola! Soy tu asistente de IA especializado en desarrollo de software. ¿En qué puedo ayudarte con este video?","bot"),window.addEventListener("storage",t=>{t.key==="currentVideo"&&(console.log("🎬 Video cambiado, limpiando chat..."),m())});const b=localStorage.setItem;localStorage.setItem=function(t,e){t==="currentVideo"&&(console.log("🎬 Video cambiado desde el mismo tab, limpiando chat..."),setTimeout(()=>m(),100)),b.apply(this,arguments)},window.copyCode=function(t){const s=t.closest(".code-block").querySelector(".code-content code").textContent;navigator.clipboard.writeText(s).then(()=>{const n=t.textContent;t.textContent="✅",t.style.background="#28a745",setTimeout(()=>{t.textContent=n,t.style.background=""},2e3)}).catch(n=>{console.error("Error copiando código:",n),t.textContent="❌",t.style.background="#dc3545",setTimeout(()=>{t.textContent="📋",t.style.background=""},2e3)})},console.log("✅ Chat inicializado correctamente")}export{I as initChat};
