import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const focusGroups = db.prepare('SELECT * FROM focus_groups ORDER BY fechaCreacion DESC').all();
    res.json(focusGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const focusGroup = db.prepare('SELECT * FROM focus_groups WHERE id = ?').get(req.params.id);
    if (!focusGroup) return res.status(404).json({ error: 'FocusGroup not found' });
    res.json(focusGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { titulo, descripcion, participantes, temas, resultados, fecha, notas } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO focus_groups (id, titulo, descripcion, participantes, temas, resultados, fecha, notas, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, titulo, descripcion || null, participantes || null, temas || null, resultados || null, fecha || null, notas || null, now, now);

    res.status(201).json({ id, titulo, descripcion, participantes, temas, resultados, fecha, notas, fechaCreacion: now, fechaActualizacion: now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { titulo, descripcion, participantes, temas, resultados, fecha, notas } = req.body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE focus_groups 
      SET titulo = ?, descripcion = ?, participantes = ?, temas = ?, resultados = ?, fecha = ?, notas = ?, fechaActualizacion = ?
      WHERE id = ?
    `).run(titulo, descripcion || null, participantes || null, temas || null, resultados || null, fecha || null, notas || null, now, req.params.id);

    if (result.changes === 0) return res.status(404).json({ error: 'FocusGroup not found' });
    res.json(db.prepare('SELECT * FROM focus_groups WHERE id = ?').get(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM focus_groups WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'FocusGroup not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
