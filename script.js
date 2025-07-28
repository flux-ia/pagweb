// 🧠 BASE DE DATOS LOCAL DE USUARIOS
const usuarios = {
  gaston: "gaston1",
  adm: "adm1",
  // Nuevos usuarios administrativos
  behm: "behm123",
  bocchetto: "boc123",
  bucala: "bucala123",
  chiner: "chiner123",
  estebaneugenia: "estebaneugenia1",
  estebanluciana: "estebanluciana",
  fernandezgaston: "fernandezgaston1",
  fernandezjuan: "fernandezjuan1",
  laubert: "laubert123",
  machaca: "machaca123",
  vaghioscar: "vaghioscar123",
  vaghipablo: "vaghipablo123",
  vaghiroque: "vaghiroque456",
  
  // Usuarios técnicos
  aguirrez: "aguirrez1",
  alarcon: "alarcon1",
  alejo: "alejo1",
  aranda: "aranda1",
  barraza: "barraza1",
  batistini: "batistini1",
  beltran: "beltran123",
  caceres: "caceres123",
  calderon: "calderon1",
  cancino: "cancino123",
  cañette: "cañette123",
  ceballos: "ceballos1",
  cimino: "cimino123",
  cruz: "cruz123",
  diazluis: "diazluis1",
  diazmanuel: "diazmanuel1",
  figueroa:"figueroa1",
  galeassialexis: "galeassialexis1",
  galeassieric: "galeassieric1",
  gallegos: "gallegos123",
  griecco: "griecco123",
  gutierrez: "gutierrez123",
  iglesiaspedro: "iglesiaspedro",
  iglesiashugo: "iglesiashugo",
  kunz: "kunz123",
  lagos: "lagos123",
  madariaga: "madariaga123",
  mas: "mas123",
  medinaalvaro: "medinaalvaro",
  medinaenzo: "medinaenzo",
  mendoza: "mendoza123",
  navarro: "navarro123",
  nieva: "nieva123",
  olleta: "olleta123",
  ortizalejandro: "ortiz123",
  ortizoscar: "ortiz456",
  paz: "paz123",
  presentado: "presentado123",
  quintaye: "quintaye123",
  quiroga: "quiroga123",
  rios: "rios123",
  ruiz: "ruiz123",
  sanchez: "sanchez123",
  sartori: "sartori123",
  serrano: "serrano123",
  tejedaadrian: "tejedaadrian",
  tejedaaldo: "tejedaaldo",
  trovato: "trovato123",
  vaghi:"vaghi",
  zelaya:"zelaya"
};

// 🔐 LOGIN
function login() {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const pass     = document.getElementById('password').value.trim();

  if (!username || !pass) return mostrarMensaje("❗ Por favor completá ambos campos.", true);
  if (!(username in usuarios)) return mostrarMensaje("🚫 Usuario no registrado.", true);
  if (usuarios[username] !== pass) return mostrarMensaje("🔑 Contraseña incorrecta.", true);

  // Mostrar panel principal
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('employeeName').textContent = username;

  // Botones según perfil
  document.getElementById('kmFormBtn').classList.remove('hidden');
  document.getElementById('etiquetaFormBtn').classList.remove('hidden');
  document.getElementById('adminBtn').classList.toggle('hidden', username !== 'adm');
   localStorage.setItem("username", username);
}

// 🔁 MOSTRAR FORMULARIOS
function showKmForm() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('kmForm').classList.remove('hidden');
  document.getElementById('fotoOdometro').value = "";
  document.getElementById('fotoPreview').style.display = 'none';
}

function showEtiquetaForm() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('etiquetaForm').classList.remove('hidden');
  document.getElementById('cantidadEtiquetas').value = "";
  document.getElementById('etiquetasAsignadas').style.display = 'none';
}

function showCargaEtiquetas() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('registroEtiquetasForm').classList.remove('hidden');
}

function volver() {
  document.getElementById('kmForm').classList.add('hidden');
  document.getElementById('etiquetaForm').classList.add('hidden');
  document.getElementById('registroEtiquetasForm').classList.add('hidden');
  document.getElementById('panelMisEtiquetas').classList.add('hidden');
  document.getElementById('panelMensajes').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
}

function ocultarTodosLosFormularios() {
  document.getElementById('kmForm').classList.add('hidden');
  document.getElementById('etiquetaForm').classList.add('hidden');
  document.getElementById('registroEtiquetasForm').classList.add('hidden');
  document.getElementById('panelMisEtiquetas').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

// ✅ ENVIAR REGISTRO DE KM
async function enviarKM() {
  const empleado  = document.getElementById('employeeName').textContent;
  const patente   = document.getElementById('patente').value;
  const kmFinal   = document.getElementById('kmFinal').value;
  const fotoInput = document.getElementById('fotoOdometro');
  const fechaHora = new Date().toLocaleString();

  if (!patente || !kmFinal) {
    mostrarMensaje("🚗 Completá todos los campos para registrar KM.", true);
    return;
  }

  mostrarMensaje("⏳ Enviando registro...", false, true);

  try {
    const datos = {
      funcion : "registro_km",
      usuario : empleado,
      patente : patente,
      km_final: kmFinal,
      fecha   : fechaHora
    };

    if (fotoInput.files[0]) {
      datos.foto = await convertirImagenABase64(fotoInput.files[0]);
    }

    const respuesta = await enviarConTimeout(
      "https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20",
      datos,
      15000
    );

    console.log("RESPUESTA KM:", respuesta); // 🐞 Debugging extra

    // 🔍 Interpretar respuesta con flexibilidad
    let mensajeFinal = "";

    if (Array.isArray(respuesta)) {
      mensajeFinal = respuesta[0]?.mensaje || respuesta[0]?.Mensaje;
    } else {
      mensajeFinal = respuesta?.mensaje || respuesta?.Mensaje;
    }


    // 🚦 Evaluar éxito
    if (mensajeFinal === "Registro guardado correctamente") {
      mostrarMensaje(`✅ Registro exitoso!<br><b>Patente:</b> ${patente}<br><b>KM:</b> ${kmFinal}`);
      document.getElementById('patente').value = "";
      document.getElementById('kmFinal').value = "";
      document.getElementById('fotoOdometro').value = "";
      document.getElementById('fotoPreview').style.display = 'none';
    } else {
      const errorMsg = mensajeFinal || respuesta?.error || "Error desconocido en el servidor";
      
    }
  } catch (error) {
    console.error("Error en enviarKM:", error);
    mostrarMensaje(`❌ Falló el envío: ${error.message}`, true);
  }
}


// 🏷️ PEDIR ETIQUETAS
function enviarEtiqueta() {
  const empleado  = document.getElementById('employeeName').textContent;
  const cantidad  = parseInt(document.getElementById('cantidadEtiquetas').value);
  const fechaHora = new Date().toLocaleString();

  if (isNaN(cantidad) || cantidad < 1) {
    mostrarMensaje("⚠️ ¡Poné una cantidad válida!", true);
    return;
  }

  mostrarMensaje("⏳ Enviando pedido al servidor... Esperando respuesta...");

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("⏰ Tiempo agotado: no se recibieron etiquetas.")), 30000)
  );

  const fetchRequest = fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({
      funcion: "pedir_etiquetas",
      usuario: empleado,
      cantidad: cantidad,
      fecha  : fechaHora
    })
  }).then(res => res.json());

  Promise.race([fetchRequest, timeout])
    .then(data => {
      const etiquetasDiv = document.getElementById("etiquetasAsignadas");
      const listaUl      = document.getElementById("listaEtiquetas");
      listaUl.innerHTML  = "";

      if (!data.etiquetas || (Array.isArray(data.etiquetas) && data.etiquetas.length === 0)) {
        etiquetasDiv.style.display = "none";
        mostrarMensaje("⚠️ No hay etiquetas disponibles en este momento.", true);
        return;
      }

      const etiquetas = Array.isArray(data.etiquetas) ? data.etiquetas : [data.etiquetas];

      etiquetasDiv.style.display = "block";
      etiquetas.forEach(etq => {
        const li = document.createElement("li");
        li.textContent = etq;
        listaUl.appendChild(li);
      });

      localStorage.setItem("etiquetasAsignadas", JSON.stringify(etiquetas));

      mostrarMensaje(`✅ Pedido procesado correctamente.<br>
        <b>Cantidad:</b> ${cantidad}<br>
        <b>Fecha:</b> ${fechaHora}<br><br>
        <b>Etiquetas asignadas:</b><br>${etiquetas.join("<br>")}`);
    })
    .catch(err => {
      console.error("❌ Error al conectar con n8n:", err);
      mostrarMensaje(err.message || "❌ Error desconocido al pedir etiquetas.", true);
    });
}

// ✅ REGISTRAR NUEVAS ETIQUETAS (ADMIN)
function registrarEtiquetas() {
  const desde     = parseInt(document.getElementById("etiquetaInicio").value);
  const hasta     = parseInt(document.getElementById("etiquetaFin").value);
  const empleado  = document.getElementById('employeeName').textContent;
  const fechaHora = new Date().toLocaleString();

  if (isNaN(desde) || isNaN(hasta) || desde < 0 || hasta < desde) {
    mostrarMensaje("❌ Por favor ingresá un rango válido.", true);
    return;
  }

  const etiquetas = [];
  for (let i = desde; i <= hasta; i++) {
    etiquetas.push(`ETQ-${String(i).padStart(3, '0')}`);
  }

  const datos = {
    funcion : "registro_etiquetas_admin",
    usuario : empleado,
    fecha   : fechaHora,
    etiquetas
  };

  mostrarMensaje("⏳ Registrando nuevas etiquetas...");

  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(respuesta => {
  if (!respuesta || typeof respuesta.Mensaje !== "string") {
    mostrarMensaje("❌ Respuesta inválida del servidor.", true);
    return;
  }

  console.log("RESPUESTA REGISTRO:", respuesta);

  const mensaje = respuesta.Mensaje;

  if (mensaje.toLowerCase().includes("ya existen")) {
    mostrarMensaje(`❌ Error: ${mensaje}`, true);
  } else {
    mostrarMensaje(
      `✅ ${mensaje}<br><br>` +
      `<b>Etiquetas:</b><br>${etiquetas.join("<br>")}<br><br>` +
      `<b>Fecha:</b> ${fechaHora}`
    );
  }
})

  .catch(err => {
    console.error("❌ Error al registrar etiquetas:", err);
    mostrarMensaje("❌ No se pudo registrar las etiquetas en el servidor.", true);
  });
}

// 🎯 PANEL DE MENSAJES
function mostrarMensaje(mensaje, esError = false, esLoader = false) {
  const panel     = document.getElementById("panelMensajes");
  const contenido = document.getElementById("contenidoMensaje");

  contenido.innerHTML     = esLoader ? `<div class="loader"></div><br>${mensaje}` : mensaje;
  contenido.style.color   = esError ? "red" : "black";

  ocultarTodosLosFormularios();
  panel.classList.remove("hidden");
}

// 🔄 AUXILIARES
function convertirImagenABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error("Error al procesar la foto"));
    reader.readAsDataURL(file);
  });
}

async function enviarConTimeout(url, datos, timeoutMs) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(datos),
      signal : controller.signal
    });

    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error("El servidor no respondió a tiempo");
    throw error;
  }
}

// 👀 HISTORIAL DE ETIQUETAS (VERSIÓN CORREGIDA)
function obtenerHistorialEtiquetas() {
  const username = document.getElementById("employeeName").textContent;

  if (!username) {
    mostrarMensaje("Error: Usuario no identificado");
    return;
  }

  mostrarMensaje("Consultando historial de etiquetas...");
  
  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
  funcion: "historial_etiquetas", 
  usuario: username 
})
  })
  .then(response => response.json())
.then(respuesta => {
  console.log("RESPUESTA:", respuesta);

  let mensaje = null;

  if (Array.isArray(respuesta)) {
    mensaje = respuesta[0]?.Mensaje;
  } else if (respuesta?.Mensaje) {
    mensaje = respuesta.Mensaje;
  }

  const contenidoHistorial = mensaje
    ? formatearHistorial(mensaje)
    : "<p>No se encontró historial o el formato de respuesta es incorrecto.</p>";

  const panelHistorial = document.getElementById("panelMisEtiquetas");
  const contenidoHistorialDiv = document.getElementById("contenidoHistorial");

  contenidoHistorialDiv.innerHTML = contenidoHistorial;
  document.getElementById("panelMensajes").classList.add("hidden"); // 👈 Este es el que oculta el recuadro de arriba
  panelHistorial.classList.remove("hidden");
})


  .catch(error => {
    console.error("Error obteniendo historial:", error);
    mostrarMensaje("Error al consultar el historial.");
  });
}
function formatearHistorial(mensajeN8N) {
  const bloques = mensajeN8N
    .split('\n\n')
    .filter(b => b.trim() !== '');
    
  return bloques
    .map(b => `<p>${b.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

// 🚀 INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  // Login con Enter
  [document.getElementById("username"), document.getElementById("password")]
    .forEach(i => i.addEventListener("keypress", e => e.key === "Enter" && login()));

  // Preview foto odómetro
  document.getElementById('fotoOdometro').addEventListener('change', e => {
    const preview = document.getElementById('fotoPreview');
    if (e.target.files[0]) {
      preview.src = URL.createObjectURL(e.target.files[0]);
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  });
});
