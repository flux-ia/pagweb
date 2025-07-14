// 🧠 BASE DE DATOS LOCAL DE USUARIOS (USUARIO:"CONTRASEÑA")
const usuarios = {
  gaston: "gaston1",
  adm: "adm1"
};

// 🔐 FUNCIÓN DE LOGIN (sin cambios)
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

// 🔁 MOSTRAR FORMULARIOS (sin cambios)
function showKmForm() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('kmForm').classList.remove('hidden');
  document.getElementById('fotoOdometro').value = ""; // Limpiar input de foto al abrir el form
}

/* Resto de funciones showEtiquetaForm(), showCargaEtiquetas(), volver() sin cambios */

// ✅ ENVIAR REGISTRO DE KM (MODIFICADO PARA FOTOS)
function enviarKM() {
  const empleado = document.getElementById('employeeName').textContent;
  const patente = document.getElementById('patente').value;
  const kmFinal = document.getElementById('kmFinal').value;
  const fotoInput = document.getElementById('fotoOdometro');
  const fechaHora = new Date().toLocaleString();

  if (!patente || !kmFinal) {
    mostrarMensaje("🚗 Completá todos los campos para registrar KM.", true);
    return;
  }

  // Si no hay foto, enviar solo datos normales
  if (!fotoInput.files[0]) {
    enviarDatosKM({ empleado, patente, kmFinal, fechaHora });
    return;
  }

  // Procesar foto como Base64
  mostrarMensaje("📸 Procesando imagen...");
  const reader = new FileReader();

  reader.onload = () => {
    const fotoBase64 = reader.result.split(',')[1]; // Remover prefijo data:image/*
    enviarDatosKM({ empleado, patente, kmFinal, fechaHora, fotoBase64 });
  };

  reader.onerror = () => {
    mostrarMensaje("❌ Error al leer la foto. Probá nuevamente.", true);
  };

  reader.readAsDataURL(fotoInput.files[0]);
}

// Función auxiliar para enviar datos a n8n
function enviarDatosKM({ empleado, patente, kmFinal, fechaHora, fotoBase64 }) {
  const datos = {
    funcion: "registro_km",
    usuario: empleado,
    patente: patente,
    km_final: kmFinal,
    fecha: fechaHora,
    ...(fotoBase64 && { foto: fotoBase64 }) // Agregar foto solo si existe
  };

  mostrarMensaje("⏳ Enviando registro al servidor...");

  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
  .then(response => response.json())
  .then(data => {
    let mensaje = `✅ Registro exitoso.<br><b>Patente:</b> ${patente}<br><b>KM:</b> ${kmFinal}`;
    if (data.rutaFoto) mensaje += `<br><b>Foto guardada:</b> ${data.rutaFoto}`;
    mostrarMensaje(mensaje);
  })
  .catch(err => {
    console.error("Error:", err);
    mostrarMensaje("❌ Falló el envío. Chequeá tu conexión.", true);
  });
}

/* 🏷️ PEDIR ETIQUETAS (sin cambios) */
function enviarEtiqueta() {
  // ... (mismo código existente)
}

/* ✅ REGISTRAR NUEVAS ETIQUETAS (ADMIN) (sin cambios) */
function registrarEtiquetas() {
  // ... (mismo código existente)
}

/* ✅ PANEL DE MENSAJES (sin cambios) */
function mostrarMensaje(mensaje, esError = false) {
  // ... (mismo código existente)
}

// 🚀 INIT (agregado evento para preview de foto)
document.addEventListener("DOMContentLoaded", () => {
  // ... (eventos de login existentes)

  // Preview de foto seleccionada
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
