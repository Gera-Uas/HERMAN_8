import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const historias = db.prepare('SELECT * FROM historias_usuario ORDER BY fechaCreacion DESC').all();
    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const historia = db.prepare('SELECT * FROM historias_usuario WHERE id = ?').get(req.params.id);
    if (!historia) return res.status(404).json({ error: 'Historia not found' });
    res.json(historia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { titulo, descripcion, aceptacion, prioridad, estimacion, estado, funcionId } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO historias_usuario (id, titulo, descripcion, aceptacion, prioridad, estimacion, estado, funcionId, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, titulo, descripcion || null, aceptacion || null, prioridad || null, estimacion || null, estado || 'pendiente', funcionId || null, now, now);

    res.status(201).json({ id, titulo, descripcion, aceptacion, prioridad, estimacion, estado, funcionId, fechaCreacion: now, fechaActualizacion: now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { titulo, descripcion, aceptacion, prioridad, estimacion, estado, funcionId } = req.body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE historias_usuario 
      SET titulo = ?, descripcion = ?, aceptacion = ?, prioridad = ?, estimacion = ?, estado = ?, funcionId = ?, fechaActualizacion = ?
      WHERE id = ?
    `).run(titulo, descripcion || null, aceptacion || null, prioridad || null, estimacion || null, estado || 'pendiente', funcionId || null, now, req.params.id);

    if (result.changes === 0) return res.status(404).json({ error: 'Historia not found' });

    res.json(db.prepare('SELECT * FROM historias_usuario WHERE id = ?').get(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM historias_usuario WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Historia not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
