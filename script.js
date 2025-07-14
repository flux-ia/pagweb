// 🧠 BASE DE DATOS LOCAL DE USUARIOS (USUARIO:"CONTRASEÑA")
const usuarios = {
  gaston: "gaston1",
  adm: "adm1"
};

// 🔐 FUNCIÓN DE LOGIN 
function login() {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const pass = document.getElementById('password').value.trim();

  if (!username || !pass) return mostrarMensaje("❗ Por favor completá ambos campos.", true);
  if (!(username in usuarios)) return mostrarMensaje("🚫 Usuario no registrado.", true);
  if (usuarios[username] !== pass) return mostrarMensaje("🔑 Contraseña incorrecta.", true);

  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('employeeName').textContent = username;

  document.getElementById('kmFormBtn').classList.remove('hidden');
  document.getElementById('etiquetaFormBtn').classList.remove('hidden');
  document.getElementById('adminBtn').classList.toggle('hidden', username !== 'adm');
}

// 🔁 MOSTRAR FORMULARIOS
function showKmForm() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('kmForm').classList.remove('hidden');
  document.getElementById('fotoOdometro').value = "";
}

function ocultarTodosLosFormularios() {
  document.getElementById('kmForm').classList.add('hidden');
  document.getElementById('etiquetaForm').classList.add('hidden');
  document.getElementById('registroEtiquetasForm')?.classList.add('hidden');
  document.getElementById('panelMisEtiquetas')?.classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

// ✅ ENVIAR REGISTRO DE KM (VERSIÓN FINAL)
async function enviarKM() {
  const empleado = document.getElementById('employeeName').textContent;
  const patente = document.getElementById('patente').value;
  const kmFinal = document.getElementById('kmFinal').value;
  const fotoInput = document.getElementById('fotoOdometro');
  const fechaHora = new Date().toLocaleString();

  if (!patente || !kmFinal) {
    mostrarMensaje("🚗 Completá todos los campos para registrar KM.", true);
    return;
  }

  mostrarMensaje("⏳ Enviando registro...", false, true);

  try {
    const datos = {
      funcion: "registro_km",
      usuario: empleado,
      patente: patente,
      km_final: kmFinal,
      fecha: fechaHora
    };

    if (fotoInput.files[0]) {
      datos.foto = await convertirImagenABase64(fotoInput.files[0]);
    }

    const respuesta = await enviarConTimeout(
      "https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20",
      datos,
      15000
    );

    if (respuesta.ok) {
      mostrarMensaje(`✅ Registro exitoso!<br><b>Patente:</b> ${patente}<br><b>KM:</b> ${kmFinal}`);
    } else {
      throw new Error(respuesta.error || "Error en el servidor");
    }
  } catch (error) {
    console.error("Error en enviarKM:", error);
    mostrarMensaje(`❌ Falló el envío: ${error.message}`, true);
  }
}

// 🔄 FUNCIONES AUXILIARES
function convertirImagenABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error("Error al procesar la foto"));
    reader.readAsDataURL(file);
  });
}

async function enviarConTimeout(url, datos, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error("El servidor no respondió a tiempo");
    }
    throw error;
  }
}

// 🎁 FUNCIÓN MOSTRAR MENSAJE (ÚNICA VERSIÓN)
function mostrarMensaje(mensaje, esError = false, esLoader = false) {
  const panel = document.getElementById("panelMensajes");
  const contenido = document.getElementById("contenidoMensaje");

  contenido.innerHTML = esLoader 
    ? `<div class="loader"></div><br>${mensaje}`
    : mensaje;
  contenido.style.color = esError ? "red" : "black";

  ocultarTodosLosFormularios();
  panel.classList.remove("hidden");
}

// 🚀 INIT
document.addEventListener("DOMContentLoaded", () => {
  // Login con Enter
  const loginInputs = [document.getElementById("username"), document.getElementById("password")];
  loginInputs.forEach(input => {
    input.addEventListener("keypress", (e) => e.key === "Enter" && login());
  });

  // Preview de foto
  document.getElementById('fotoOdometro').addEventListener('change', function(e) {
    const preview = document.getElementById('fotoPreview');
    if (e.target.files[0]) {
      preview.src = URL.createObjectURL(e.target.files[0]);
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  });
});
