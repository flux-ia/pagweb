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
}

function showEtiquetaForm() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('etiquetaForm').classList.remove('hidden');

  const etiquetasDiv = document.getElementById("etiquetasAsignadas");
  const listaUl = document.getElementById("listaEtiquetas");
  etiquetasDiv.style.display = "none";
  if (listaUl) listaUl.innerHTML = "";
}

function showCargaEtiquetas() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('registroEtiquetasForm').classList.remove('hidden');
}

function volver() {
  document.getElementById('kmForm').classList.add('hidden');
  document.getElementById('etiquetaForm').classList.add('hidden');
  document.getElementById('registroEtiquetasForm')?.classList.add('hidden');
  document.getElementById('panelMisEtiquetas')?.classList.add('hidden');
  document.getElementById('panelMensajes')?.classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
}

// ✅ ENVIAR REGISTRO DE KM
function enviarKM() {
  const empleado = document.getElementById('employeeName').textContent;
  const patente = document.getElementById('patente').value;
  const kmFinal = document.getElementById('kmFinal').value;
  const fechaHora = new Date().toLocaleString();

  if (!patente || !kmFinal) {
    mostrarMensaje("🚗 Completá todos los campos para registrar KM.", true);
    return;
  }

  const datos = {
    funcion: "registro_km",
    usuario: empleado,
    patente: patente,
    km_final: kmFinal,
    fecha: fechaHora
  };

  mostrarMensaje("⏳ Enviando registro de KM al servidor...");

  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
  .then(() => {
    mostrarMensaje(`✅ Registro de KM enviado correctamente.<br><br>
    <b>Empleado:</b> ${empleado}<br>
    <b>Patente:</b> ${patente}<br>
    <b>KM Final:</b> ${kmFinal}<br>
    <b>Fecha:</b> ${fechaHora}`);
  })
  .catch(err => {
    console.error("❌ Error al enviar KM:", err);
    mostrarMensaje("❌ No se pudo enviar el registro de KM.", true);
  });
}

// 🏷️ PEDIR ETIQUETAS
function enviarEtiqueta() {
  const empleado = document.getElementById('employeeName').textContent;
  const cantidad = parseInt(document.getElementById('cantidadEtiquetas').value);
  const fechaHora = new Date().toLocaleString();

  if (isNaN(cantidad) || cantidad < 1) {
    mostrarMensaje("⚠️ ¡Poné una cantidad válida!", true);
    return;
  }

  mostrarMensaje("⏳ Enviando pedido al servidor... Esperando respuesta...");

  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("⏰ Tiempo agotado: no se recibieron etiquetas.")), 30000);
  });

  const fetchRequest = fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      funcion: "pedir_etiquetas",
      usuario: empleado,
      cantidad: cantidad,
      fecha: fechaHora
    })
  }).then(res => res.json());

  Promise.race([fetchRequest, timeout])
    .then(data => {
      const etiquetasDiv = document.getElementById("etiquetasAsignadas");
      const listaUl = document.getElementById("listaEtiquetas");
      listaUl.innerHTML = "";

      if (!data.etiquetas || (Array.isArray(data.etiquetas) && data.etiquetas.length === 0)) {
        etiquetasDiv.style.display = "none";
        mostrarMensaje("⚠️ No hay etiquetas disponibles en este momento.", true);
        return;
      }

      const etiquetas = Array.isArray(data.etiquetas)
        ? data.etiquetas
        : [data.etiquetas];

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

// ✅ PANEL DE MENSAJES
function mostrarMensaje(mensaje, esError = false) {
  const panel = document.getElementById("panelMensajes");
  const contenido = document.getElementById("contenidoMensaje");

  contenido.innerHTML = mensaje;
  contenido.style.color = esError ? "red" : "black";

  ocultarTodosLosFormularios();
  panel.classList.remove("hidden");
}

function ocultarTodosLosFormularios() {
  document.getElementById('kmForm').classList.add('hidden');
  document.getElementById('etiquetaForm').classList.add('hidden');
  document.getElementById('registroEtiquetasForm')?.classList.add('hidden');
  document.getElementById('panelMisEtiquetas')?.classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('panelMensajes')?.classList.add('hidden');
}

// 🚀 INIT
document.addEventListener("DOMContentLoaded", () => {
  const loginInputs = [document.getElementById("username"), document.getElementById("password")];
  loginInputs.forEach(input => {
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") login();
    });
  });
});
