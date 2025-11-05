const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(__dirname, 'data');
const FILE_PATH = path.join(DATA_DIR, 'fundaciones.json');

app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, '[]', 'utf8');

function readData() {
  const raw = fs.readFileSync(FILE_PATH, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}
function writeData(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}


app.get('/api/fundaciones', (req, res) => {
  const data = readData();
  res.json(data);
});

app.post('/api/fundaciones', (req, res) => {
  const nueva = req.body;
  if (!nueva || !nueva.nombre) {
    return res.status(400).json({ error: 'Falta campo nombre' });
  }
  const data = readData();
  // opcional prevenir duplicados por nombre
  // if (data.some(f => f.nombre === nueva.nombre)) { ... }

  data.push(nueva);
  writeData(data);
  res.status(201).json({ success: true, fundacion: nueva });
});


app.get('/', (req, res) => res.send('API Puente Solidario OK'));

app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));

// Eliminar una fundación por nombre (en mayúsculas)
app.delete('/api/fundaciones/:nombre', (req, res) => {
  const nombre = req.params.nombre.toUpperCase();
  let data = readData();

  const nuevaLista = data.filter(f => f.nombre !== nombre);

  if (nuevaLista.length === data.length) {
    return res.status(404).json({ error: 'Fundación no encontrada' });
  }

  writeData(nuevaLista);
  res.json({ success: true, eliminado: nombre });
});