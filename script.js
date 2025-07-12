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

  // SIEMPRE OCULTAR y limpiar el panel al abrir el formulario
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
  .then(res => res.json())
  .then(respuesta => {
    const contenido = `📝 Registro de KM\nEmpleado: ${empleado}\nPatente: ${patente}\nKM final: ${kmFinal}\nFecha: ${fechaHora}`;
    descargarComoTxt(`registro_km_${empleado}.txt`, contenido);

    // Muestra la respuesta del servidor si la hay, sino solo OK
    alert(`✅ Registro de KM enviado.\n${respuesta.mensaje ? respuesta.mensaje : 'Registro exitoso.'}`);
    volver();
  })
  .catch(err => {
    console.error("❌ Error al enviar KM:", err);
    alert("❌ No se pudo enviar el registro de KM.");
  });
}


// 🏷️ PEDIR ETIQUETAS CON FETCH + TIMEOUT + GUARDADO
function enviarEtiqueta() {
  const empleado = document.getElementById('employeeName').textContent;
  const cantidad = parseInt(document.getElementById('cantidadEtiquetas').value);
  const fechaHora = new Date().toLocaleString();

  if (isNaN(cantidad) || cantidad < 1) {
    alert("¡Poné una cantidad válida!");
    return;
  }

  alert("⏳ Enviando pedido al servidor... Esperando respuesta hasta 30 segundos...");

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
      // Aquí nos aseguramos de que data.etiquetas sea siempre un array
      const etiquetas = Array.isArray(data.etiquetas)
        ? data.etiquetas
        : (typeof data.etiquetas === "string" ? [data.etiquetas] : []);

      const etiquetasDiv = document.getElementById("etiquetasAsignadas");
      const listaUl = document.getElementById("listaEtiquetas");

      listaUl.innerHTML = "";

      if (etiquetas.length === 0) {
        etiquetasDiv.style.display = "none";
        alert("⚠️ No se recibieron etiquetas desde el servidor.");
        return;
      }

      etiquetasDiv.style.display = "block";

      etiquetas.forEach(etq => {
        const li = document.createElement("li");
        li.textContent = etq;
        listaUl.appendChild(li);
      });

      localStorage.setItem("etiquetasAsignadas", JSON.stringify(etiquetas));

      const lista = etiquetas.join(", ");
      const contenido = `🏷️ Pedido de Etiquetas\nEmpleado: ${empleado}\nCantidad: ${cantidad}\nEtiquetas asignadas:\n${lista}\nFecha: ${fechaHora}`;
      descargarComoTxt(`etiquetas_${empleado}.txt`, contenido);

      volver();
    })
    .catch(err => {
      console.error("❌ Error al conectar con n8n:", err);
      alert(err.message || "❌ Error desconocido al pedir etiquetas.");
    });
}



// 🚩 MOSTRAR HISTORIAL DE ETIQUETAS DESDE BACKEND
function mostrarMisEtiquetas() {
  const empleado = document.getElementById('employeeName').textContent;
  // Oculta dashboard y muestra panel historial
  document.getElementById('dashboard').classList.add('hidden');
  const panel = document.getElementById("panelMisEtiquetas");
  panel.classList.remove('hidden');
  panel.innerHTML = "<h3>Mis etiquetas</h3><p>Cargando historial...</p>";

  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      funcion: "historial_etiquetas",
      usuario: empleado
    })
  })
  .then(res => res.json())
  .then(historico => {
    if (!Array.isArray(historico) || historico.length === 0) {
      panel.innerHTML = "<h3>Mis etiquetas</h3><p>No tenés pedidos anteriores.</p>";
      return;
    }

    let html = "<h3>Mis etiquetas</h3>";
    historico.forEach(pedido => {
      html += `
        <div class="pedido-historico">
          <div class="pedido-fecha"><b>Fecha:</b> ${pedido.fecha}</div>
          <div class="pedido-lista"><b>Etiquetas:</b> 
            <span class="etiquetas-historico">
              ${pedido.etiquetas.map(e => `<span class="chip-etiqueta">${e}</span>`).join('')}
            </span>
          </div>
        </div>
      `;
    });
    panel.innerHTML = html + `<button onclick="cerrarMisEtiquetas()">Volver</button>`;
  })
  .catch(err => {
    panel.innerHTML = "<h3>Mis etiquetas</h3><p style='color:red'>Error al cargar historial.</p>";
    console.error("❌ Error al cargar historial:", err);
  });
}

function cerrarMisEtiquetas() {
  document.getElementById('panelMisEtiquetas').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
}

// 📸 ENVIAR FOTO DE ODÓMETRO (simulado base64)
function enviarFotoOdometro() {
  const empleado = document.getElementById('employeeName').textContent;
  const fileInput = document.getElementById('fotoKm');
  const fechaHora = new Date().toLocaleString();
  const file = fileInput.files[0];

  if (!file) return alert("📸 Tenés que seleccionar una imagen.");

  const reader = new FileReader();
  reader.onload = function () {
    const base64 = reader.result;

    const datos = {
      funcion: "subir_foto_odometro",
      usuario: empleado,
      fecha: fechaHora,
      imagen_base64: base64
    };

    fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
    .then(() => {
      alert("✅ Foto enviada correctamente.");
    })
    .catch(err => {
      console.error("❌ Error al subir la foto:", err);
      alert("❌ No se pudo subir la imagen.");
    });
  };
  reader.readAsDataURL(file);
}

// ✅ REGISTRAR NUEVAS ETIQUETAS (ADMIN)
function registrarEtiquetas() {
  const desde = parseInt(document.getElementById("etiquetaInicio").value);
  const hasta = parseInt(document.getElementById("etiquetaFin").value);
  const empleado = document.getElementById('employeeName').textContent;
  const fechaHora = new Date().toLocaleString();

  if (isNaN(desde) || isNaN(hasta) || desde < 1 || hasta < desde) {
    alert("Por favor ingresá un rango válido.");
    return;
  }

  const etiquetas = [];
  for (let i = desde; i <= hasta; i++) {
    etiquetas.push(`ETQ-${String(i).padStart(3, '0')}`);
  }

  const datos = {
    funcion: "registro_etiquetas_admin",
    usuario: empleado,
    fecha: fechaHora,
    etiquetas: etiquetas
  };

  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(respuesta => {
    // Manejá lo que devuelve el webhook (si devuelve algo relevante)
    const lista = etiquetas.join(", ");
    const contenido = `📦 NUEVAS ETIQUETAS REGISTRADAS\nRango: ETQ-${desde} a ETQ-${hasta}\nTotal: ${etiquetas.length}\nListado:\n${lista}\nFecha: ${fechaHora}`;
    descargarComoTxt(`registro_etiquetas_ETQ-${desde}_a_ETQ-${hasta}.txt`, contenido);

    alert(`✅ ¡Se registraron ${etiquetas.length} etiquetas!\nRespuesta del servidor: ${JSON.stringify(respuesta)}`);
    volver();
  })
  .catch(err => {
    console.error("❌ Error al registrar etiquetas:", err);
    alert("❌ No se pudo registrar las etiquetas en el servidor.");
  });
}

// 📄 DESCARGAR ARCHIVO TXT
function descargarComoTxt(nombreArchivo, contenido) {
  const blob = new Blob([contenido], { type: 'text/plain' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = nombreArchivo;
  enlace.click();
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
