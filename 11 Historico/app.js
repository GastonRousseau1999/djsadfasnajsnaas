// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCb0YDrpY7DzvNXDiICZAp-s1u3BQWzZ20",
  authDomain: "historico-af172.firebaseapp.com",
  projectId: "historico-af172",
  storageBucket: "historico-af172.firebasestorage.app",
  messagingSenderId: "468194339938",
  appId: "1:468194339938:web:97383dc53ba06cb3db753b",
  measurementId: "G-BVJY53WLRN"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variable global para almacenar los jugadores
let players = [];

// Cargar jugadores desde el archivo JSON
async function cargarJugadores() {
  try {
    const response = await fetch('players.json');
    const data = await response.json();
    players = data.players;
  } catch (error) {
    console.error('Error al cargar los jugadores:', error);
    alert('Error al cargar los jugadores');
  }
}

// Abrir galería
let currentTarget = null;
let selectedPlayer = null;

function showPlayerInfo(player) {
  const container = document.getElementById('selectedPlayerContainer');
  const image = document.getElementById('selectedPlayerImage');
  const name = document.getElementById('selectedPlayerName');
  const description = document.getElementById('selectedPlayerDescription');
  const agregarBtn = document.getElementById('agregarJugadorBtn');

  image.src = player.img;
  name.textContent = player.name;
  description.textContent = player.description;
  container.classList.add('active');
  agregarBtn.disabled = false;
  
  // Remover selección previa si existe
  const previousSelected = document.querySelector('.gallery-grid img.selected');
  if (previousSelected) {
    previousSelected.classList.remove('selected');
  }
}

function crearPosicion(config) {
  const posDiv = document.createElement("div");
  posDiv.classList.add("position");
  posDiv.setAttribute("data-posicion", config.posicion);
  posDiv.setAttribute("onclick", "openGallery(this)");
  posDiv.style.top = `${config.top}%`;
  posDiv.style.left = `${config.left}%`;

  const playerDiv = document.createElement("div");
  playerDiv.classList.add("player");
  
  const img = document.createElement("img");
  img.src = "images/vacante.jpg";
  img.alt = "Jugador";
  playerDiv.appendChild(img);
  
  const nameDiv = document.createElement("div");
  nameDiv.classList.add("player-name");
  
  posDiv.appendChild(playerDiv);
  posDiv.appendChild(nameDiv);
  return posDiv;
}

function confirmarSeleccion() {
  if (selectedPlayer && currentTarget) {
    currentTarget.querySelector('img').src = selectedPlayer.img;
    currentTarget.setAttribute('data-name', selectedPlayer.name);
    
    // Actualizar el nombre debajo de la posición
    const nameDiv = currentTarget.parentElement.querySelector('.player-name');
    nameDiv.textContent = selectedPlayer.name;
    
    // Agregar clase para la animación
    const positionDiv = currentTarget.parentElement;
    positionDiv.classList.add('player-added');
    
    // Remover la clase después de que termine la animación
    setTimeout(() => {
      positionDiv.classList.remove('player-added');
    }, 500);
    
    closeGallery();
  }
}

function quitarJugador() {
  if (currentTarget) {
    currentTarget.querySelector('img').src = "images/vacante.jpg";
    currentTarget.setAttribute('data-name', '');
    
    // Limpiar el nombre
    const nameDiv = currentTarget.parentElement.querySelector('.player-name');
    nameDiv.textContent = '';
    
    closeGallery();
  }
}

function openGallery(target) {
  currentTarget = target.querySelector('.player');
  const grid = document.getElementById('galleryGrid');
  const modal = document.getElementById('galleryModal');
  grid.innerHTML = '';

  const posicionActual = target.getAttribute('data-posicion');
  const container = document.getElementById('selectedPlayerContainer');
  container.classList.remove('active');
  
  document.getElementById('agregarJugadorBtn').disabled = true;

  const jugadoresFiltrados = players.filter(p =>
    p.posiciones.includes(posicionActual)
  );

  // Agregar opción de quitar jugador solo si hay un jugador seleccionado
  if (currentTarget.getAttribute('data-name')) {
    const quitarDiv = document.createElement('div');
    quitarDiv.style.position = 'relative';
    const quitarImg = document.createElement('img');
    quitarImg.src = 'images/x.png';
    quitarImg.alt = 'Quitar jugador';
    quitarImg.style.cursor = 'pointer';
    quitarImg.onclick = quitarJugador;
    quitarDiv.appendChild(quitarImg);
    grid.appendChild(quitarDiv);
  }

  jugadoresFiltrados.forEach(p => {
    const img = document.createElement('img');
    img.src = p.img;
    img.alt = p.name;
    img.onclick = () => {
      selectedPlayer = p;
      showPlayerInfo(p);
      img.classList.add('selected');
    };
    grid.appendChild(img);
  });

  modal.style.display = 'block';
  modal.offsetHeight; // Forzar reflow
  modal.classList.add('active');
}

function closeGallery() {
  const modal = document.getElementById('galleryModal');
  modal.classList.remove('active');
  
  // Esperar a que termine la animación antes de ocultar el modal
  setTimeout(() => {
    modal.style.display = 'none';
    selectedPlayer = null;
    document.getElementById('agregarJugadorBtn').disabled = true;
  }, 300); // 300ms = duración de la transición
}

// Formaciones disponibles
const formaciones = {
  "4-4-2":[{ posicion: "Arquero", top: 90, left: 50 },

    { posicion: "Lateral Izquierdo", top: 70, left: 30 },
    { posicion: "Central Izquierdo", top: 70, left: 42 },
    { posicion: "Central Derecho", top: 70, left: 58 },
    { posicion: "Lateral Derecho", top: 70, left: 70 },

    { posicion: "Interior Izquierdo", top: 45, left: 30 },
    { posicion: "Volante Izquierdo", top: 45, left: 42 },
    { posicion: "Volante Derecho", top: 45, left: 58 },
    { posicion: "Interior Derecho", top: 45, left: 70 },

    { posicion: "Delantero Izquierdo", top: 10, left: 40 },
    { posicion: "Delantero Derecho", top: 10, left: 60 }],

  "4-3-3": [{ posicion: "Arquero", top: 90, left: 50 },

    { posicion: "Lateral Izquierdo", top: 70, left: 30 },
    { posicion: "Central Izquierdo", top: 70, left: 42 },
    { posicion: "Central Derecho", top: 70, left: 58 },
    { posicion: "Lateral Derecho", top: 70, left: 70 },

    { posicion: "Volante Contencion", top: 50, left: 50 },
    { posicion: "Volante Izquierdo", top: 35, left: 42 },
    { posicion: "Volante Derecho", top: 35, left: 58 },

    { posicion: "Extremo Izquierdo", top: 15, left: 30 },
    { posicion: "Delantero Centro", top: 10, left: 50 },
    { posicion: "Extremo Derecho", top: 15, left: 70 }],

  "3-5-2": { Delanteros: 2, Mediocampistas: 5, Defensas: 3, Arquero: 1 },
  "4-1-2-3": { Delanteros: 3, Mediocampistas: 2, Contencion: 1, Defensas: 4, Arquero: 1 }
};

// Cargar formación en la cancha
async function cargarFormacion(nombre) {
  const cancha = document.querySelector(".pitch");
  const posicionesActuales = document.querySelectorAll('.position');
  const formacion = formaciones[nombre];

  // Crear un mapa de las posiciones actuales y sus jugadores
  const jugadoresActuales = new Map();
  posicionesActuales.forEach(pos => {
    const posicion = pos.getAttribute('data-posicion');
    const playerDiv = pos.querySelector('.player');
    const playerName = playerDiv.getAttribute('data-name');
    const playerImg = playerDiv.querySelector('img').src;
    if (playerName) {
      jugadoresActuales.set(posicion, { name: playerName, img: playerImg });
    }
  });

  // Si hay posiciones actuales, animamos su agrupación
  if (posicionesActuales.length > 0) {
    // Paso 1: Todas las posiciones se contraen
    posicionesActuales.forEach(pos => {
      pos.classList.add('transitioning');
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    // Paso 2: Todas se mueven al centro
    posicionesActuales.forEach(pos => {
      pos.classList.add('grouping');
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Remover las posiciones que no existen en la nueva formación
    Array.from(posicionesActuales).forEach(pos => {
      const posicion = pos.getAttribute('data-posicion');
      const existeEnNuevaFormacion = formacion.some(f => f.posicion === posicion);
      if (!existeEnNuevaFormacion) {
        pos.remove();
      }
    });
  }

  // Crear las nuevas posiciones que no existían
  formacion.forEach(({ posicion, top, left }) => {
    const posicionExistente = document.querySelector(`[data-posicion="${posicion}"]`);
    if (!posicionExistente) {
      const posDiv = crearPosicion({ posicion, top, left });
      posDiv.classList.add('entering');
      
      // Verificar si había un jugador en esta posición
      const jugadorPrevio = jugadoresActuales.get(posicion);
      if (jugadorPrevio) {
        const playerDiv = posDiv.querySelector('.player');
        playerDiv.querySelector('img').src = jugadorPrevio.img;
        playerDiv.setAttribute('data-name', jugadorPrevio.name);
        posDiv.querySelector('.player-name').textContent = jugadorPrevio.name;
      }
      
      cancha.appendChild(posDiv);
    }
  });

  // Esperar un momento para asegurar que todas las posiciones estén en el centro
  await new Promise(resolve => setTimeout(resolve, 50));

  // Distribuir todas las posiciones a sus lugares finales
  const todasLasPosiciones = document.querySelectorAll('.position');
  todasLasPosiciones.forEach((pos) => {
    const posicion = pos.getAttribute('data-posicion');
    const config = formacion.find(f => f.posicion === posicion);
    if (config) {
      pos.style.top = `${config.top}%`;
      pos.style.left = `${config.left}%`;
      pos.classList.add('spreading-out');
    }
  });

  // Remover clases de animación después de que termine
  await new Promise(resolve => setTimeout(resolve, 500));
  todasLasPosiciones.forEach(pos => {
    pos.classList.remove('entering', 'transitioning', 'grouping');
  });
}

// Modificar la función window.onload para que sea async
window.onload = async () => {
  await cargarJugadores();
  await cargarFormacion("4-4-2");
};

// Guardar plantilla (formato interno)
function guardarPlantilla() {
  const posiciones = document.querySelectorAll('.position');
  const plantilla = [];

  posiciones.forEach(pos => {
    const posicion = pos.getAttribute('data-posicion');
    const jugador = pos.querySelector('.player')?.getAttribute('data-name') || "";
    plantilla.push({ posicion, jugador });
  });

  return plantilla;
}

// Verificar email en Firestore
async function verificarEmail(email) {
  const querySnapshot = await getDocs(query(collection(db, "plantillas"), where("email", "==", email)));
  return !querySnapshot.empty;
}

// Funciones para el modal de envío
function mostrarModalEnvio() {
  const modal = document.getElementById('sendModal');
  const messageDiv = modal.querySelector('.message');
  const emailInput = document.getElementById('emailInput');
  
  // Resetear estado
  messageDiv.style.display = 'none';
  messageDiv.textContent = '';
  messageDiv.className = 'message';
  emailInput.value = '';
  
  // Mostrar modal
  modal.style.display = 'block';
  modal.offsetHeight; // Forzar reflow
  modal.classList.add('active');
}

function cerrarModalEnvio() {
  const modal = document.getElementById('sendModal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

function mostrarMensaje(mensaje, tipo) {
  const messageDiv = document.querySelector('#sendModal .message');
  messageDiv.textContent = mensaje;
  messageDiv.className = `message ${tipo}`;
  messageDiv.style.display = 'block';
}

async function confirmarEnvio() {
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim();
  const plantilla = guardarPlantilla();

  // Verificar que haya jugadores seleccionados
  const hayJugadores = plantilla.some(p => p.jugador !== "");
  if (!hayJugadores) {
    mostrarMensaje("❌ Debes seleccionar al menos un jugador", "error");
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    mostrarMensaje("❌ Por favor ingresa un email válido", "error");
    return;
  }

  try {
    // Verificar si el email ya envió una plantilla
    const yaExiste = await verificarEmail(email);
    if (yaExiste) {
      mostrarMensaje("❌ Ya has enviado una plantilla anteriormente con este email", "error");
      return;
    }

    // Enviar plantilla
    await addDoc(collection(db, "plantillas"), {
      fecha: new Date().toISOString(),
      email: email,
      data: plantilla
    });

    mostrarMensaje("✅ Plantilla enviada correctamente", "success");
    setTimeout(cerrarModalEnvio, 2000);
  } catch (error) {
    console.error("Error al enviar a Firestore:", error);
    mostrarMensaje("❌ Error al enviar la plantilla", "error");
  }
}

// Modificar la función enviarPlantilla para usar el nuevo modal
function enviarPlantilla() {
  mostrarModalEnvio();
}

// Exportar funciones
window.enviarPlantilla = enviarPlantilla;
window.openGallery = openGallery;
window.closeGallery = closeGallery;
window.cargarFormacion = cargarFormacion;
window.confirmarSeleccion = confirmarSeleccion;
window.quitarJugador = quitarJugador;
window.confirmarEnvio = confirmarEnvio;
window.cerrarModalEnvio = cerrarModalEnvio;
