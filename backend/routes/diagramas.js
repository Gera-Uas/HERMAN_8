import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const diagramas = db.prepare('SELECT * FROM diagramas ORDER BY fechaCreacion DESC').all();
    res.json(diagramas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const diagrama = db.prepare('SELECT * FROM diagramas WHERE id = ?').get(req.params.id);
    if (!diagrama) {
      return res.status(404).json({ error: 'Diagrama not found' });
    }
    res.json(diagrama);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { id, tipo, nombre, descripcion, funcionId } = req.body;
    const diagramId = id || `${tipo || 'diagram'}-${Date.now()}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO diagramas (id, tipo, nombre, descripcion, funcionId, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(diagramId, tipo, nombre, descripcion || null, funcionId || null, now, now);

    res.status(201).json({
      id: diagramId,
      tipo,
      nombre,
      descripcion,
      funcionId,
      fechaCreacion: now,
      fechaActualizacion: now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { tipo, nombre, descripcion, funcionId } = req.body;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE diagramas
      SET tipo = ?, nombre = ?, descripcion = ?, funcionId = ?, fechaActualizacion = ?
      WHERE id = ?
    `);

    const result = stmt.run(tipo, nombre, descripcion || null, funcionId || null, now, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Diagrama not found' });
    }

    const diagrama = db.prepare('SELECT * FROM diagramas WHERE id = ?').get(req.params.id);
    res.json(diagrama);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM diagramas WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Diagrama not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;