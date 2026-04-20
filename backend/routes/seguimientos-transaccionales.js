import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const seguimientos = db.prepare('SELECT * FROM seguimientos_transaccionales ORDER BY fechaCreacion DESC').all();
    res.json(seguimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const seguimiento = db.prepare('SELECT * FROM seguimientos_transaccionales WHERE id = ?').get(req.params.id);
    if (!seguimiento) return res.status(404).json({ error: 'Seguimiento not found' });
    res.json(seguimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { titulo, descripcion, transacciones, actores, flujo, excepciones } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO seguimientos_transaccionales (id, titulo, descripcion, transacciones, actores, flujo, excepciones, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, titulo, descripcion || null, transacciones || null, actores || null, flujo || null, excepciones || null, now, now);

    res.status(201).json({ id, titulo, descripcion, transacciones, actores, flujo, excepciones, fechaCreacion: now, fechaActualizacion: now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { titulo, descripcion, transacciones, actores, flujo, excepciones } = req.body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE seguimientos_transaccionales 
      SET titulo = ?, descripcion = ?, transacciones = ?, actores = ?, flujo = ?, excepciones = ?, fechaActualizacion = ?
      WHERE id = ?
    `).run(titulo, descripcion || null, transacciones || null, actores || null, flujo || null, excepciones || null, now, req.params.id);

    if (result.changes === 0) return res.status(404).json({ error: 'Seguimiento not found' });
    res.json(db.prepare('SELECT * FROM seguimientos_transaccionales WHERE id = ?').get(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM seguimientos_transaccionales WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Seguimiento not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
