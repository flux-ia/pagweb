// 🧠 BASE DE DATOS LOCAL DE USUARIOS (USUARIO:"CONTRASEÑA")
const usuarios = {
  gaston: "gaston1",
  adm: "adm1"
};

// 🔐 FUNCIÓN DE LOGIN
function login() {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const pass = document.getElementById('password').value.trim();

  if (!username || !pass) return alert("Por favor completá ambos campos.");
  if (!(username in usuarios)) return alert("Usuario no registrado.");
  if (usuarios[username] !== pass) return alert("Contraseña incorrecta.");

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
  document.getElementById('dashboard').classList.remove('hidden');
}

// ✅ ENVIAR REGISTRO DE KM
function enviarKM() {
  const empleado = document.getElementById('employeeName').textContent;
  const patente = document.getElementById('patente').value;
  const kmFinal = document.getElementById('kmFinal').value;
  const fechaHora = new Date().toLocaleString();

  if (!patente || !kmFinal) {
    alert("Completá todos los campos.");
    return;
  }

  const datos = {
    funcion: "registro_km",
    usuario: empleado,
    patente: patente,
    km_final: kmFinal,
    fecha: fechaHora
  };

  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
  .then(res => res.text())
  .then(texto => {
    alert("✅ Registro de KM enviado correctamente.");
    volver();
  })
  .catch(err => {
    console.error("❌ Error al enviar KM:", err);
    alert("❌ No se pudo enviar el registro de KM.");
  });
}

// 🏷️ PEDIR ETIQUETAS
function enviarEtiqueta() {
  const empleado = document.getElementById('employeeName').textContent;
  const cantidad = parseInt(document.getElementById('cantidadEtiquetas').value);
  const fechaHora = new Date().toLocaleString();

  if (isNaN(cantidad) || cantidad < 1) {
    alert("¡Poné una cantidad válida!");
    return;
  }

  alert("⏳ Enviando pedido al servidor...");

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
        alert("⚠️ No hay etiquetas disponibles en este momento.");
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
    })
    .catch(err => {
      console.error("❌ Error al conectar con n8n:", err);
      alert(err.message || "❌ Error desconocido al pedir etiquetas.");
    });
}

// Si querés que también se eliminen los .txt del resto de funciones como registrarEtiquetas, avisame y te lo ajusto 😄

document.addEventListener("DOMContentLoaded", () => {
  const loginInputs = [document.getElementById("username"), document.getElementById("password")];
  loginInputs.forEach(input => {
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") login();
    });
  });
});
