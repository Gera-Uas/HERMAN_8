import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const encuestas = db.prepare('SELECT * FROM encuestas ORDER BY fechaCreacion DESC').all();
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const encuesta = db.prepare('SELECT * FROM encuestas WHERE id = ?').get(req.params.id);
    if (!encuesta) return res.status(404).json({ error: 'Encuesta not found' });
    res.json(encuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { titulo, descripcion, preguntas, respuestas } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO encuestas (id, titulo, descripcion, preguntas, respuestas, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, titulo, descripcion || null, preguntas || null, respuestas || null, now, now);

    res.status(201).json({ id, titulo, descripcion, preguntas, respuestas, fechaCreacion: now, fechaActualizacion: now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { titulo, descripcion, preguntas, respuestas } = req.body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE encuestas 
      SET titulo = ?, descripcion = ?, preguntas = ?, respuestas = ?, fechaActualizacion = ?
      WHERE id = ?
    `).run(titulo, descripcion || null, preguntas || null, respuestas || null, now, req.params.id);

    if (result.changes === 0) return res.status(404).json({ error: 'Encuesta not found' });
    res.json(db.prepare('SELECT * FROM encuestas WHERE id = ?').get(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM encuestas WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Encuesta not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
