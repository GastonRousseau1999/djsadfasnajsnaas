const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

const HISTORIAL_PATH = 'historial.json';
const PLANTILLA_PATH = 'plantilla.json';

app.use(cors());
app.use(express.json());

// Cargar historial existente si el archivo ya existe
let todasLasPlantillas = [];
if (fs.existsSync(HISTORIAL_PATH)) {
  const contenido = fs.readFileSync(HISTORIAL_PATH, 'utf-8');
  try {
    todasLasPlantillas = JSON.parse(contenido);
  } catch (error) {
    console.error("Error al leer historial.json:", error);
    todasLasPlantillas = [];
  }
}

app.post('/guardar-plantilla', (req, res) => {
  const plantilla = req.body;
  console.log("Plantilla recibida:", plantilla);

  try {
    // Agregar al historial en memoria
    todasLasPlantillas.push(plantilla);

    // Guardar historial completo en historial.json
    fs.writeFileSync(HISTORIAL_PATH, JSON.stringify(todasLasPlantillas, null, 2));

    // Guardar también en plantilla.json como acumulado
    let plantillaAcumulada = [];
    if (fs.existsSync(PLANTILLA_PATH)) {
      const contenido = fs.readFileSync(PLANTILLA_PATH, 'utf-8');
      plantillaAcumulada = JSON.parse(contenido);
    }
    plantillaAcumulada.push(plantilla);
    fs.writeFileSync(PLANTILLA_PATH, JSON.stringify(plantillaAcumulada, null, 2));

    console.log("Total de registros:", todasLasPlantillas.length);

    res.status(200).json({
      mensaje: "Plantilla guardada correctamente.",
      total_registros: todasLasPlantillas.length
    });
  } catch (error) {
    console.error("Error al guardar historial:", error);
    res.status(500).json({ mensaje: "Error al guardar historial." });
  }
});

app.listen(3000, () => {
  console.log('Servidor local escuchando en http://localhost:3000');
});
