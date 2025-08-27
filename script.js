// 🧠 BASE DE DATOS LOCAL DE USUARIOS
const usuarios = {
  gaston: "gaston1",
  adm: "adm1", // SUPERADMIN

  // Admins por patrulla
  admin_laplata: "adminlp1",
  admin_cordoba: "admincba1",
  admin_rioiv: "adminrio1",
  admin_bahiablanca: "adminbb1",
  admin_sanluis: "adminsl1",
  admin_salta: "adminsa1",
  admin_tucuman: "admintuc1",

  // Nuevos usuarios administrativos (pueden ser SUPERADMIN si querés)
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
  figueroa: "figueroa1",
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
  vaghiroque: "vaghi",
  zelaya: "zelaya"
};

// 🧑‍⚖️ ROLES
// SUPERADMIN: ve todas las patentes y tiene botón Admin
// ADMIN: ve solo su patrulla y tiene botón Admin
// TECNICO: ve solo su patrulla
const userRole = {
  adm: "SUPERADMIN",

  // Admins por patrulla
  admin_laplata: "ADMIN",
  admin_cordoba: "ADMIN",
  admin_rioiv: "ADMIN",
  admin_bahiablanca: "ADMIN",
  admin_sanluis: "ADMIN",
  admin_salta: "ADMIN",
  admin_tucuman: "ADMIN",

  // Si querés que alguna de estas sea SUPERADMIN, agregala acá como "SUPERADMIN"
  // behm: "SUPERADMIN", ...
};

const getRole   = (u) => userRole[u] || "TECNICO";
const getSector = (u) => userSector[u] || null;

// 🧭 SECTOR (PATRULLA) POR USUARIO
const userSector = {
  // Admins por patrulla
  admin_laplata: "LA PLATA",
  admin_cordoba: "CÓRDOBA",
  admin_rioiv: "RÍO IV",
  admin_bahiablanca: "BAHÍA BLANCA",
  admin_sanluis: "SAN LUIS",
  admin_salta: "SALTA",
  admin_tucuman: "TUCUMÁN",

  // (vaghiroque es técnico/coord. en TUCUMÁN)
  vaghiroque: "TUCUMÁN",

  // LA PLATA
  aguirrez: "LA PLATA",
  alejo: "LA PLATA",
  mas: "LA PLATA",
  ortizalejandro: "LA PLATA",
  ortizoscar: "LA PLATA",
  sartori: "LA PLATA",

  // TUCUMÁN
  alarcon: "TUCUMÁN",
  beltran: "TUCUMÁN",
  cruz: "TUCUMÁN",
  gutierrez: "TUCUMÁN",
  medinaalvaro: "TUCUMÁN",
  navarro: "TUCUMÁN",
  nieva: "TUCUMÁN",
  olleta: "TUCUMÁN",
  paz: "TUCUMÁN",
  ruiz: "TUCUMÁN",
  serrano: "TUCUMÁN",
  vaghiroque: "TUCUMÁN",
  zelaya: "TUCUMÁN",

  // CÓRDOBA
  aranda: "CÓRDOBA",
  barraza: "CÓRDOBA",
  caceres: "CÓRDOBA",
  calderon: "CÓRDOBA",
  cañette: "CÓRDOBA",
  galeassialexis: "CÓRDOBA",
  galeassieric: "CÓRDOBA",
  gallegos: "CÓRDOBA",
  griecco: "CÓRDOBA",
  iglesiaspedro: "CÓRDOBA",
  iglesiashugo: "CÓRDOBA",
  presentado: "CÓRDOBA",
  quiroga: "CÓRDOBA",
  rios: "CÓRDOBA",
  sanchez: "CÓRDOBA",
  tejedaadrian: "CÓRDOBA",

  // RÍO IV
  batistini: "RÍO IV",
  ceballos: "RÍO IV",
  figueroa: "RÍO IV",
  kunz: "RÍO IV",
  lagos: "RÍO IV",

  // BAHÍA BLANCA
  quintaye: "BAHÍA BLANCA",
  trovato: "BAHÍA BLANCA",

  // SAN LUIS
  cancino: "SAN LUIS",

  // SALTA
  cimino: "SALTA",
  diazluis: "SALTA",
  diazmanuel: "SALTA",
  madariaga: "SALTA",

  

  // Otros sin sector específico (ajustar si corresponde)
  medinaenzo: "CÓRDOBA",
  
};

// 🚗 PATENTES POR SECTOR
const sectorPatentes = {
  "LA PLATA": ["AA317PM", "AA420JU", "AH280OQ", "AH571SO", "NEO135", "PDY875", "PKZ249"],
  "TUCUMÁN": ["AB403NQ", "AC079TW", "AD964TK", "AE017FB", "AH335IM", "NWX351", "PQE699"],
  "CÓRDOBA": ["AA980XO","AB861HC","AC111MD","AD964TJ","AE327LO","AE464FY","AE683IX","AE727HQ","AF766ZB","AG883IG","AH335FM","ITJ845","IUY548","IVZ434","NEO134","OPC046","OXJ953"],
  "RÍO IV": ["AB794YT", "AG727MO"],
  "BAHÍA BLANCA": ["AA925PQ", "OIC618"],
  "SAN LUIS": ["AE287YW"],
  "SALTA": ["AH017QS", "KDG674", "OUM376"]
};

// 🧩 Utilidad: lista total de patentes (fallback)
const TODAS_LAS_PATENTES = Array.from(new Set(Object.values(sectorPatentes).flat()));



// 🔐 LOGIN
function login() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const pass = document.getElementById("password").value.trim();

  if (!username || !pass) return mostrarMensaje("❗ Por favor completá ambos campos.", true);
  if (!(username in usuarios)) return mostrarMensaje("🚫 Usuario no registrado.", true);
  if (usuarios[username] !== pass) return mostrarMensaje("🔑 Contraseña incorrecta.", true);

  const role = getRole(username);

  // Ocultar cualquier cartel previo de error
  const panel = document.getElementById("panelMensajes");
  const cont = document.getElementById("contenidoMensaje");
  if (panel) panel.classList.add("hidden");
  if (cont) cont.innerHTML = "";

  // Mostrar panel principal
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("employeeName").textContent = username;

  // Mostrar patrulla en la UI
  const patrullaUser = getSector(username) || (role === "SUPERADMIN" ? "TODAS" : "SIN PATRULLA");
  const patrullaLabel = document.getElementById("employeePatrulla");
  if (patrullaLabel) patrullaLabel.textContent = patrullaUser;

  // Botones según perfil
  document.getElementById("kmFormBtn").classList.remove("hidden");
  document.getElementById("etiquetaFormBtn").classList.remove("hidden");
  document.getElementById("adminBtn").classList.toggle("hidden", !(role === "ADMIN" || role === "SUPERADMIN"));

  // Guardar user y preparar patentes por sector
  localStorage.setItem("username", username);
  populatePatentesForUser(username); // por si entra directo a KM
}

// 🔁 MOSTRAR FORMULARIOS
function showKmForm() {
  const username = document.getElementById("employeeName").textContent;
  populatePatentesForUser(username);
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("kmForm").classList.remove("hidden");
  document.getElementById("fotoOdometro").value = "";
  document.getElementById("fotoPreview").style.display = "none";
}

function showEtiquetaForm() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("etiquetaForm").classList.remove("hidden");
  document.getElementById("cantidadEtiquetas").value = "";
  document.getElementById("etiquetasAsignadas").style.display = "none";
}

function showCargaEtiquetas() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("registroEtiquetasForm").classList.remove("hidden");
}

function volver() {
  document.getElementById("kmForm").classList.add("hidden");
  document.getElementById("etiquetaForm").classList.add("hidden");
  document.getElementById("registroEtiquetasForm").classList.add("hidden");
  document.getElementById("panelMisEtiquetas").classList.add("hidden");
  document.getElementById("panelMensajes").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}

function ocultarTodosLosFormularios() {
  document.getElementById("kmForm").classList.add("hidden");
  document.getElementById("etiquetaForm").classList.add("hidden");
  document.getElementById("registroEtiquetasForm").classList.add("hidden");
  document.getElementById("panelMisEtiquetas").classList.add("hidden");
  document.getElementById("dashboard").classList.add("hidden");
}

// 👉 Rellena el <select id="patente"> con las patentes del sector del usuario
function populatePatentesForUser(username) {
  const select = document.getElementById("patente");
  if (!select) return;

  const role   = getRole(username);
  const sector = getSector(username);
  let patentes = [];

  if (role === "SUPERADMIN") {
    patentes = TODAS_LAS_PATENTES; // ve todo
  } else if (role === "ADMIN") {
    patentes = sector && sectorPatentes[sector] ? sectorPatentes[sector] : [];
  } else {
    // Técnico
    patentes = sector && sectorPatentes[sector] ? sectorPatentes[sector] : TODAS_LAS_PATENTES;
  }

  // Poblar el select
  select.innerHTML = "";
  if (patentes.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "Sin patentes disponibles";
    opt.value = "";
    select.appendChild(opt);
  } else {
    patentes.forEach((p) => {
      const opt = document.createElement("option");
      opt.textContent = p;
      opt.value = p;
      select.appendChild(opt);
    });
  }
}

// ✅ ENVIAR REGISTRO DE KM
async function enviarKM() {
  const empleado = document.getElementById("employeeName").textContent;
  const patente = document.getElementById("patente").value;
  const kmFinal = document.getElementById("kmFinal").value;
  const fotoInput = document.getElementById("fotoOdometro");
  const fechaHora = new Date().toLocaleString();

  if (!patente || !kmFinal) {
    mostrarMensaje("🚗 Completá todos los campos para registrar KM.", true);
    return;
  }
if (!fotoInput.files[0]) {
  mostrarMensaje("📷 Tenés que subir una foto del tablero para registrar los KM.", true);
  return;
}

  mostrarMensaje("⏳ Enviando registro...", false, true);

  const datos = {
    funcion: "registro_km",
    usuario: empleado,
    patrulla: getSector(empleado) || "",
    patente: patente,
    km_final: kmFinal,
    fecha: fechaHora
  };

  if (fotoInput.files[0]) {
    datos.foto = await convertirImagenABase64(fotoInput.files[0]);
  }

  try {
    const response = await fetch(
      "https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      }
    );

    const respuesta = await response.json();
    console.log("RESPUESTA KM:", respuesta);

    const mensaje = respuesta?.Mensaje;
    if (!mensaje || typeof mensaje !== "string") {
      mostrarMensaje("❌ Respuesta inválida del servidor.", true);
      return;
    }

    if (mensaje === "Registro guardado correctamente") {
      mostrarMensaje(`✅ Registro exitoso!<br><b>Patente:</b> ${patente}<br><b>KM:</b> ${kmFinal}`);
      document.getElementById("patente").value = "";
      document.getElementById("kmFinal").value = "";
      document.getElementById("fotoOdometro").value = "";
      document.getElementById("fotoPreview").style.display = "none";
    } else {
      mostrarMensaje(`❌ Error: ${mensaje}`, true);
    }
  } catch (error) {
    console.error("❌ Error en enviarKM:", error);
    mostrarMensaje("❌ No se pudo registrar los KM en el servidor.", true);
  }
}

// 🏷️ PEDIR ETIQUETAS
function enviarEtiqueta() {
  const empleado = document.getElementById("employeeName").textContent;
  const cantidad = parseInt(document.getElementById("cantidadEtiquetas").value);
  const fechaHora = new Date().toLocaleString();

  if (isNaN(cantidad) || cantidad < 1) {
    mostrarMensaje("⚠️ ¡Poné una cantidad válida!", true);
    return;
  }

  mostrarMensaje("⏳ Enviando pedido al servidor... Esperando respuesta...");

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("⏰ Tiempo agotado: no se recibieron etiquetas.")), 30000)
  );

  const fetchRequest = fetch(
    "https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        funcion: "pedir_etiquetas",
        usuario: empleado,
        patrulla: getSector(empleado) || "",
        cantidad: cantidad,
        fecha: fechaHora
      })
    }
  ).then((res) => res.json());

  Promise.race([fetchRequest, timeout])
    .then((data) => {
  const etiquetasDiv = document.getElementById("etiquetasAsignadas");
  const listaUl = document.getElementById("listaEtiquetas");
  listaUl.innerHTML = "";

  if (!data.etiquetas || (Array.isArray(data.etiquetas) && data.etiquetas.length === 0)) {
    etiquetasDiv.style.display = "none";
    mostrarMensaje("⚠️ No hay etiquetas disponibles en este momento.", true);
    return;
  }

  // Normalizar a array
  const etiquetas = Array.isArray(data.etiquetas) ? data.etiquetas : [data.etiquetas];
  const recibidas = etiquetas.length;

  // Mostrar lista visual
  etiquetasDiv.style.display = "block";
  etiquetas.forEach((etq) => {
    const li = document.createElement("li");
    li.textContent = etq;
    listaUl.appendChild(li);
  });

  // Guardar localmente
  localStorage.setItem("etiquetasAsignadas", JSON.stringify(etiquetas));

  // Mensaje base
  let msg =
    `✅ Pedido procesado correctamente.<br>` +
    `<b>Cantidad solicitada:</b> ${cantidad}<br>` +
    `<b>Fecha:</b> ${fechaHora}<br><br>` +
    `<b>Etiquetas asignadas:</b><br>${etiquetas.join("<br>")}`;

  // Aviso si vinieron menos que las pedidas
  if (recibidas < cantidad) {
    const faltan = cantidad - recibidas;
    msg +=
      `<br><br><b>⚠️ Solo había ${recibidas} disponible${recibidas === 1 ? "" : "s"}.</b> ` +
      `(${faltan} pendiente${faltan === 1 ? "" : "s"})`;
  }

  mostrarMensaje(msg);
})

    .catch((err) => {
      console.error("❌ Error al conectar con n8n:", err);
      mostrarMensaje(err.message || "❌ Error desconocido al pedir etiquetas.", true);
    });
}

// ✅ REGISTRAR NUEVAS ETIQUETAS (ADMIN)
function registrarEtiquetas() {
  const desde = parseInt(document.getElementById("etiquetaInicio").value);
  const hasta = parseInt(document.getElementById("etiquetaFin").value);
  const empleado = document.getElementById("employeeName").textContent;
  const fechaHora = new Date().toLocaleString();

  if (isNaN(desde) || isNaN(hasta) || desde < 0 || hasta < desde) {
    mostrarMensaje("❌ Por favor ingresá un rango válido.", true);
    return;
  }

  const etiquetas = [];
  for (let i = desde; i <= hasta; i++) {
    etiquetas.push(`ETQ-${String(i).padStart(3, "0")}`);
  }

  const datos = {
    funcion: "registro_etiquetas_admin",
    usuario: empleado,
    patrulla: getSector(empleado) || "",
    fecha: fechaHora,
    etiquetas
  };

  mostrarMensaje("⏳ Registrando nuevas etiquetas...");

  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
    .then((res) => res.json())
    .then((respuesta) => {
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
    .catch((err) => {
      console.error("❌ Error al registrar etiquetas:", err);
      mostrarMensaje("❌ No se pudo registrar las etiquetas en el servidor.", true);
    });
}

// 🎯 PANEL DE MENSAJES
function mostrarMensaje(mensaje, esError = false, esLoader = false) {
  const panel = document.getElementById("panelMensajes");
  const contenido = document.getElementById("contenidoMensaje");

  contenido.innerHTML = esLoader ? `<div class="loader"></div><br>${mensaje}` : mensaje;
  contenido.style.color = esError ? "red" : "black";

  ocultarTodosLosFormularios();
  panel.classList.remove("hidden");
}

// 🔄 AUXILIARES
function convertirImagenABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
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
    if (error.name === "AbortError") throw new Error("El servidor no respondió a tiempo");
    throw error;
  }
}

// 👀 HISTORIAL DE ETIQUETAS
function obtenerHistorialEtiquetas() {
  const username = document.getElementById("employeeName").textContent;

  if (!username) {
    mostrarMensaje("Error: Usuario no identificado");
    return;
  }

  mostrarMensaje("Consultando historial de etiquetas...");

  fetch("https://fluxian8n-n8n.mpgtdy.easypanel.host/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      funcion: "historial_etiquetas",
      usuario: username,
      patrulla: getSector(username) || ""
    })
  })
    .then((response) => response.json())
    .then((respuesta) => {
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
      document.getElementById("panelMensajes").classList.add("hidden");
      panelHistorial.classList.remove("hidden");
    })
    .catch((error) => {
      console.error("Error obteniendo historial:", error);
      mostrarMensaje("Error al consultar el historial.");
    });
}

function formatearHistorial(mensajeN8N) {
  const bloques = mensajeN8N
    .split("\n\n")
    .filter((b) => b.trim() !== "");

  return bloques
    .map((b) => `<p>${b.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

// 🚀 INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  // Login con Enter
  [document.getElementById("username"), document.getElementById("password")].forEach((i) =>
    i.addEventListener("keypress", (e) => e.key === "Enter" && login())
  );

  // Preview foto odómetro
  const fotoInput = document.getElementById("fotoOdometro");
  if (fotoInput) {
    fotoInput.addEventListener("change", (e) => {
      const preview = document.getElementById("fotoPreview");
      if (e.target.files[0]) {
        preview.src = URL.createObjectURL(e.target.files[0]);
        preview.style.display = "block";
      } else {
        preview.style.display = "none";
      }
    });
  }
});






