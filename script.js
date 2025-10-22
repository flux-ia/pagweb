/* ===========================
  Helpers de red y multimedia
  =========================== */

// Detectar si la conexión es celular para ajustar timeout
function isCellular() {
  const c = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  return !!(c && (c.type === 'cellular' || (c.effectiveType && /2g|3g|slow-2g/.test(c.effectiveType))));
}

// Comprimir imagen ANTES de pasarla a base64
async function compressFileToBase64(file, maxW = 1200, quality = 0.7) {
  if (!file.type || !file.type.startsWith('image/')) {
    return convertirImagenABase64(file);
  }
  const img = await new Promise((res, rej) => {
    const o = new Image();
    o.onload = () => res(o);
    o.onerror = rej;
    o.src = URL.createObjectURL(file);
  });
  const origW = img.naturalWidth || img.width || maxW;
  const origH = img.naturalHeight || img.height || maxW;
  const scale = Math.min(1, maxW / origW);
  if (scale >= 1) return convertirImagenABase64(file);

  const w = Math.round(origW * scale);
  const h = Math.round(origH * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  return dataUrl.split(',')[1];
}

// Wrapper de fetch con timeout, reintentos y log de errores
async function fetchJSONWithRetry(url, options, {
  tries = 3,
  timeoutMs = 60000 // Aumentado a 45 segundos como parche temporal
} = {}) {

  // URL del webhook espía (con el nuevo dominio)
  const ERROR_WEBHOOK_URL = 'https://n8n.fluxia.com.ar/webhook/c4d5c678-faa3-467c-9344-14e035e4ed14';

  let wait = 800;
  for (let i = 0; i < tries; i++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      // Intenta la petición normal a tu webhook principal
      const res = await fetch(url, { ...options, signal: ctrl.signal, cache: 'no-store', keepalive: true });
      clearTimeout(t);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      try { return text ? JSON.parse(text) : {}; } catch { return { raw: text }; }

    } catch (error) {
      clearTimeout(t);
      const errorData = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        url: url,
        attempt: i + 1,
        userAgent: navigator.userAgent
      };
      // Envía el detalle del error a tu webhook espía
      fetch(ERROR_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
        keepalive: true
      });
      if (i === tries - 1) throw error;
      await new Promise(s => setTimeout(s, wait));
      wait = Math.min(wait * 2, 4000);
    }
  }
}

/* ===========================
  Datos de usuarios / sectores
  =========================== */

const usuarios = { gaston: "gaston1", adm: "adm1", admin_laplata: "adminlp1", admin_cordoba: "admincba1", admin_rioiv: "adminrio1", admin_bahiablanca: "adminbb1", admin_sanluis: "adminsl1", admin_salta: "adminsa1", admin_tucuman: "admintuc1", behm: "behm123", bocchetto: "boc123", bucala: "bucala123", chiner: "chiner123", estebaneugenia: "estebaneugenia1", estebanluciana: "estebanluciana", fernandezgaston: "fernandezgaston1", fernandezjuan: "fernandezjuan1", laubert: "laubert123", machaca: "machaca123", vaghioscar: "vaghioscar123", vaghipablo: "vaghipablo123", vaghiroque: "vaghiroque456", aguirrez: "aguirrez1", alarcon: "alarcon1", alejo: "alejo1", aranda: "aranda1", barraza: "barraza1", batistini: "batistini1", beltran: "beltran123", caceres: "caceres123", calderon: "calderon1", cancino: "cancino123", cañette: "cañette123", ceballos: "ceballos1", cimino: "cimino123", cruz: "cruz123", diazluis: "diazluis1", diazmanuel: "diazmanuel1", figueroa: "figueroa1", galeassialexis: "galeassialexis1", galeassieric: "galeassieric1", gallegos: "gallegos123", griecco: "griecco123", gutierrez: "gutierrez123", iglesiaspedro: "iglesiaspedro", iglesiashugo: "iglesiashugo", kunz: "kunz123", lagos: "lagos123", madariaga: "madariaga123", mas: "mas123", medinaalvaro: "medinaalvaro", medinaenzo: "medinaenzo", navarro: "navarro123", nieva: "nieva123", olleta: "olleta123", ortizalejandro: "ortiz123", ortizoscar: "ortiz456", paz: "paz123", presentado: "presentado123", quintaye: "quintaye123", quiroga: "quiroga123", rios: "rios123", ruiz: "ruiz123", sanchez: "sanchez123", sartori: "sartori123", serrano: "serrano123", tejedaadrian: "tejedaadrian", tejedaaldo: "tejedaaldo", trovato: "trovato123", vaghiroque: "vaghi", zelaya: "zelaya" };
const userRole = { adm: "SUPERADMIN", admin_laplata: "ADMIN", admin_cordoba: "ADMIN", admin_rioiv: "ADMIN", admin_bahiablanca: "ADMIN", admin_sanluis: "ADMIN", admin_salta: "ADMIN", admin_tucuman: "ADMIN" };
const getRole = (u) => userRole[u] || "TECNICO";
const getSector = (u) => userSector[u] || null;
const userSector = { admin_laplata: "LA PLATA", admin_cordoba: "CÓRDOBA", admin_rioiv: "RÍO IV", admin_bahiablanca: "BAHÍA BLANCA", admin_sanluis: "SAN LUIS", admin_salta: "SALTA", admin_tucuman: "TUCUMÁN", vaghiroque: "TUCUMÁN", aguirrez: "LA PLATA", alejo: "LA PLATA", mas: "LA PLATA", ortizalejandro: "LA PLATA", ortizoscar: "LA PLATA", sartori: "LA PLATA", alarcon: "TUCUMÁN", beltran: "TUCUMÁN", cruz: "TUCUMÁN", gutierrez: "TUCUMÁN", medinaalvaro: "TUCUMÁN", navarro: "TUCUMÁN", nieva: "TUCUMÁN", olleta: "TUCUMÁN", paz: "TUCUMÁN", ruiz: "TUCUMÁN", serrano: "TUCUMÁN", zelaya: "TUCUMÁN", aranda: "CÓRDOBA", barraza: "CÓRDOBA", caceres: "CÓRDOBA", calderon: "CÓRDOBA", cañette: "CÓRDOBA", galeassialexis: "CÓRDOBA", galeassieric: "CÓRDOBA", gallegos: "CÓRDOBA", griecco: "CÓRDOBA", iglesiaspedro: "CÓRDOBA", iglesiashugo: "CÓRDOBA", presentado: "CÓRDOBA", quiroga: "CÓRDOBA", rios: "CÓRDOBA", sanchez: "CÓRDOBA", tejedaadrian: "CÓRDOBA", batistini: "RÍO IV", ceballos: "RÍO IV", figueroa: "RÍO IV", kunz: "kunz123", lagos: "lagos123", quintaye: "BAHÍA BLANCA", trovato: "BAHÍA BLANCA", cancino: "SAN LUIS", cimino: "SALTA", diazluis: "SALTA", diazmanuel: "SALTA", madariaga: "SALTA", medinaenzo: "TUCUMÁN" };
const sectorPatentes = { "LA PLATA": ["AA317PM", "AA420JU", "AH280OQ", "AH571SO", "NEO135", "PDY875", "PKZ249"], "TUCUMÁN": ["AB403NQ", "AC079TW", "AD964TK", "AE017FB", "AH335IM", "NWX351", "PQE699"], "CÓRDOBA": ["AA980XO", "AB861HC", "AC111MD", "AD964TJ", "AE327LO", "AE464FY", "AE683IX", "AE727HQ", "AF766ZB", "AG883IG", "AH335FM", "ITJ845", "IUY548", "IVZ434", "NEO134", "OPC046", "OXJ953"], "RÍO IV": ["AB794YT", "AG727MO"], "BAHÍA BLANCA": ["AA925PQ", "OIC618"], "SAN LUIS": ["AE287YW"], "SALTA": ["AH017QS", "KDG674", "OUM376"] };
const TODAS_LAS_PATENTES = Array.from(new Set(Object.values(sectorPatentes).flat()));

/* ===========================
  Lógica de UI / acciones
  =========================== */

function login() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const pass = document.getElementById("password").value.trim();
  if (!username || !pass) return mostrarMensaje("❗ Por favor completá ambos campos.", true);
  if (!(username in usuarios)) return mostrarMensaje("🚫 Usuario no registrado.", true);
  if (usuarios[username] !== pass) return mostrarMensaje("🔑 Contraseña incorrecta.", true);
  const role = getRole(username);
  document.getElementById("panelMensajes")?.classList.add("hidden");
  const contenidoMensaje = document.getElementById("contenidoMensaje");
  if (contenidoMensaje) contenidoMensaje.innerHTML = ""; // Limpiar mensaje anterior
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("employeeName").textContent = username;
  const patrullaUser = getSector(username) || (role === "SUPERADMIN" ? "TODAS" : "SIN PATRULLA");
  document.getElementById("employeePatrulla").textContent = patrullaUser;
  document.getElementById("kmFormBtn").classList.remove("hidden");
  document.getElementById("etiquetaFormBtn").classList.remove("hidden");
  document.getElementById("adminBtn").classList.toggle("hidden", !(role === "ADMIN" || role === "SUPERADMIN"));
  localStorage.setItem("username", username);
  populatePatentesForUser(username);
}

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
  document.getElementById("kmForm")?.classList.add("hidden");
  document.getElementById("etiquetaForm")?.classList.add("hidden");
  document.getElementById("registroEtiquetasForm")?.classList.add("hidden");
  document.getElementById("panelMisEtiquetas")?.classList.add("hidden");
  document.getElementById("panelMensajes")?.classList.add("hidden");
  document.getElementById("dashboard")?.classList.remove("hidden");
}

function ocultarTodosLosFormularios() {
  document.getElementById("kmForm")?.classList.add("hidden");
  document.getElementById("etiquetaForm")?.classList.add("hidden");
  document.getElementById("registroEtiquetasForm")?.classList.add("hidden");
  document.getElementById("panelMisEtiquetas")?.classList.add("hidden");
  document.getElementById("dashboard")?.classList.add("hidden");
}

function populatePatentesForUser(username) {
  const select = document.getElementById("patente");
  if (!select) return;
  const role = getRole(username);
  const sector = getSector(username);
  let patentes = [];
  if (role === "SUPERADMIN") {
    patentes = TODAS_LAS_PATENTES;
  } else if (role === "ADMIN") {
    patentes = sector && sectorPatentes[sector] ? sectorPatentes[sector] : [];
  } else {
    patentes = sector && sectorPatentes[sector] ? sectorPatentes[sector] : TODAS_LAS_PATENTES;
  }
  select.innerHTML = "";
  if (patentes.length === 0) {
    select.innerHTML = "<option value=''>Sin patentes disponibles</option>";
  } else {
    patentes.forEach(p => {
      const opt = document.createElement("option");
      opt.textContent = p;
      opt.value = p;
      select.appendChild(opt);
    });
  }
}

/* ===========================
  Envíos: KM / Etiquetas
  =========================== */

async function enviarKM() {
  const empleado = document.getElementById("employeeName").textContent;
  const patente = document.getElementById("patente").value;
  const kmFinal = document.getElementById("kmFinal").value;
  const fotoInput = document.getElementById("fotoOdometro");
  const fechaHora = new Date().toLocaleString();
  if (!patente || !kmFinal) return mostrarMensaje("🚗 Completá todos los campos para registrar KM.", true);
  //if (!fotoInput.files[0]) return mostrarMensaje("📷 Tenés que subir una foto del tablero para registrar los KM.", true);

  mostrarMensaje("⏳ Enviando registro...", false, true);
  const datos = { funcion: "registro_km", usuario: empleado, patrulla: getSector(empleado) || "", patente, km_final: kmFinal, fecha: fechaHora };
  /if (fotoInput.files[0]) {
    datos.foto = await compressFileToBase64(fotoInput.files[0]);
  }
  try {
    if (enviarKM._inflight) return;
    enviarKM._inflight = true;
    const respuesta = await fetchJSONWithRetry(
      "https://n8n.fluxia.com.ar/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      }
    );
    const mensaje = respuesta?.Mensaje;
    if (!mensaje || typeof mensaje !== "string") {
      mostrarMensaje("❌ Respuesta inválida del servidor.", true);
    } else if (mensaje === "Registro guardado correctamente") {
      mostrarMensaje(`✅ Registro exitoso!<br><b>Patente:</b> ${patente}<br><b>KM:</b> ${kmFinal}`);
      document.getElementById("kmFinal").value = "";
      /document.getElementById("fotoOdometro").value = "";
      /document.getElementById("fotoPreview").style.display = "none";
    } else {
      mostrarMensaje(`❌ Error: ${mensaje}`, true);
    }
  } catch (error) {
    mostrarMensaje("❌ Conexión inestable: reintentá en unos segundos.", true);
  } finally {
    enviarKM._inflight = false;
  }
}

async function enviarEtiqueta() {
  const empleado = document.getElementById("employeeName").textContent;
  const cantidad = parseInt(document.getElementById("cantidadEtiquetas").value);
  const fechaHora = new Date().toLocaleString();
  if (isNaN(cantidad) || cantidad < 1) return mostrarMensaje("⚠️ ¡Poné una cantidad válida!", true);
  if (enviarEtiqueta._inflight) return;
  enviarEtiqueta._inflight = true;
  try {
    mostrarMensaje("⏳ Enviando pedido al servidor... Esperando respuesta...");
    const payload = { funcion: "pedir_etiquetas", usuario: empleado, patrulla: getSector(empleado) || "", cantidad, fecha: fechaHora };
    const data = await fetchJSONWithRetry(
      "https://n8n.fluxia.com.ar/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
    const etiquetasDiv = document.getElementById("etiquetasAsignadas");
    const listaUl = document.getElementById("listaEtiquetas");
    listaUl.innerHTML = "";
    if (!data.etiquetas || (Array.isArray(data.etiquetas) && data.etiquetas.length === 0)) {
      etiquetasDiv.style.display = "none";
      return mostrarMensaje("⚠️ No hay etiquetas disponibles en este momento.", true);
    }
    const etiquetas = Array.isArray(data.etiquetas) ? data.etiquetas : [data.etiquetas];
    etiquetasDiv.style.display = "block";
    etiquetas.forEach(etq => {
      const li = document.createElement("li");
      li.textContent = etq;
      listaUl.appendChild(li);
    });
    localStorage.setItem("etiquetasAsignadas", JSON.stringify(etiquetas));
    let msg = `✅ Pedido procesado correctamente.<br><b>Cantidad solicitada:</b> ${cantidad}<br><b>Fecha:</b> ${fechaHora}<br><br><b>Etiquetas asignadas:</b><br>${etiquetas.join("<br>")}`;
    if (etiquetas.length < cantidad) {
      msg += `<br><br><b>⚠️ Solo había ${etiquetas.length} disponible(s).</b>`;
    }
    mostrarMensaje(msg);
  } catch (err) {
    mostrarMensaje(err.message || "❌ Error desconocido al pedir etiquetas.", true);
  } finally {
    enviarEtiqueta._inflight = false;
  }
}

async function registrarEtiquetas() {
  const desde = parseInt(document.getElementById("etiquetaInicio").value);
  const hasta = parseInt(document.getElementById("etiquetaFin").value);
  const empleado = document.getElementById("employeeName").textContent;
  const fechaHora = new Date().toLocaleString();
  if (isNaN(desde) || isNaN(hasta) || desde < 0 || hasta < desde) {
    return mostrarMensaje("❌ Por favor ingresá un rango válido.", true);
  }
  const etiquetas = [];
  for (let i = desde; i <= hasta; i++) {
    etiquetas.push(`ETQ-${String(i).padStart(3, "0")}`);
  }
  const datos = { funcion: "registro_etiquetas_admin", usuario: empleado, patrulla: getSector(empleado) || "", fecha: fechaHora, etiquetas };

  mostrarMensaje("⏳ Registrando nuevas etiquetas...");

  try {
    const respuesta = await fetchJSONWithRetry(
      "https://n8n.fluxia.com.ar/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      }
    );
    if (!respuesta || typeof respuesta.Mensaje !== "string") {
      return mostrarMensaje("❌ Respuesta inválida del servidor.", true);
    }
    const mensaje = respuesta.Mensaje;
    if (mensaje.toLowerCase().includes("ya existen")) {
      mostrarMensaje(`❌ Error: ${mensaje}`, true);
    } else {
      mostrarMensaje(`✅ ${mensaje}<br><br><b>Etiquetas:</b><br>${etiquetas.join("<br>")}<br><br><b>Fecha:</b> ${fechaHora}`);
    }
  } catch (err) {
    mostrarMensaje("❌ No se pudo registrar las etiquetas en el servidor.", true);
  }
}

/* ===========================
  Utilitarios de UI / red
  =========================== */

function mostrarMensaje(mensaje, esError = false, esLoader = false) {
  const panel = document.getElementById("panelMensajes");
  const contenido = document.getElementById("contenidoMensaje");

  if (!panel || !contenido) {
      console.error("Error: No se encuentran los elementos 'panelMensajes' o 'contenidoMensaje' en el HTML.");
      return;
  }

  contenido.innerHTML = esLoader ? `<div class="loader"></div><br>${mensaje}` : mensaje;
  contenido.style.color = esError ? "red" : "black";

  ocultarTodosLosFormularios(); // Oculta otros formularios
  panel.classList.remove("hidden"); // Muestra el panel de mensajes
}

function convertirImagenABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Error al procesar la foto"));
    reader.readAsDataURL(file);
  });
}

/* ===========================
  Historial de etiquetas
  =========================== */

async function obtenerHistorialEtiquetas() {
  const username = document.getElementById("employeeName").textContent;
  if (!username) return mostrarMensaje("Error: Usuario no identificado");

  mostrarMensaje("Consultando historial de etiquetas...");

  try {
    const respuesta = await fetchJSONWithRetry(
      "https://n8n.fluxia.com.ar/webhook/79ad7cbc-afc5-4d9b-967f-4f187d028a20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcion: "historial_etiquetas", usuario: username, patrulla: getSector(username) || "" })
    });

    let mensaje = Array.isArray(respuesta) ? respuesta[0]?.Mensaje : respuesta?.Mensaje;
    const contenidoHistorial = mensaje ? formatearHistorial(mensaje) : "<p>No se encontró historial.</p>";

    const panelHistorial = document.getElementById("panelMisEtiquetas");
    const contenidoDiv = document.getElementById("contenidoHistorial");

    if (!panelHistorial || !contenidoDiv) {
        console.error("Error: No se encuentran los elementos 'panelMisEtiquetas' o 'contenidoHistorial' en el HTML.");
        mostrarMensaje("❌ Error al mostrar el historial.", true);
        return;
    }

    contenidoDiv.innerHTML = contenidoHistorial;
    document.getElementById("panelMensajes")?.classList.add("hidden");
    panelHistorial.classList.remove("hidden");
  } catch (error) {
    mostrarMensaje("❌ Error al consultar el historial.", true);
  }
}

function formatearHistorial(mensajeN8N) {
  return mensajeN8N.split("\n\n").filter(b => b.trim() !== "").map(b => `<p>${b.replace(/\n/g, "<br>")}</p>`).join("");
}

/* ===========================
  Inicialización y exports
  =========================== */

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  if (usernameInput && passwordInput) {
      [usernameInput, passwordInput].forEach(i =>
          i.addEventListener("keypress", (e) => e.key === "Enter" && login())
      );
  }

  const fotoInput = document.getElementById("fotoOdometro");
  if (fotoInput) {
    fotoInput.addEventListener("change", (e) => {
      const preview = document.getElementById("fotoPreview");
      if (preview && e.target.files[0]) {
        preview.src = URL.createObjectURL(e.target.files[0]);
        preview.style.display = "block";
      } else if (preview) {
        preview.style.display = "none";
      }
    });
  }
});

// ✅ CORRECCIÓN FINAL: Bloque para exportar funciones al ámbito global.
Object.assign(window, {
  login,
  showKmForm,
  showEtiquetaForm,
  showCargaEtiquetas,
  volver,
  enviarKM,
  enviarEtiqueta,
  registrarEtiquetas,
  obtenerHistorialEtiquetas
});


