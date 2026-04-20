import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// List all funciones
router.get('/', (req, res) => {
  try {
    const funciones = db.prepare('SELECT * FROM funciones ORDER BY fechaCreacion DESC').all();
    res.json(funciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get funcion by ID
router.get('/:id', (req, res) => {
  try {
    const funcion = db.prepare('SELECT * FROM funciones WHERE id = ?').get(req.params.id);
    if (!funcion) {
      return res.status(404).json({ error: 'Funcion not found' });
    }
    res.json(funcion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create funcion
router.post('/', (req, res) => {
  try {
    const { nombre, descripcion, prioridad, estado, responsableId } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO funciones (id, nombre, descripcion, prioridad, estado, responsableId, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, nombre, descripcion || null, prioridad || null, estado || 'pendiente', responsableId || null, now, now);

    res.status(201).json({
      id,
      nombre,
      descripcion,
      prioridad,
      estado,
      responsableId,
      fechaCreacion: now,
      fechaActualizacion: now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update funcion
router.put('/:id', (req, res) => {
  try {
    const { nombre, descripcion, prioridad, estado, responsableId } = req.body;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE funciones 
      SET nombre = ?, descripcion = ?, prioridad = ?, estado = ?, responsableId = ?, fechaActualizacion = ?
      WHERE id = ?
    `);

    const result = stmt.run(nombre, descripcion || null, prioridad || null, estado || 'pendiente', responsableId || null, now, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Funcion not found' });
    }

    const funcion = db.prepare('SELECT * FROM funciones WHERE id = ?').get(req.params.id);
    res.json(funcion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete funcion
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM funciones WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Funcion not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
