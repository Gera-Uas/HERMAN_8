import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const entrevistas = db.prepare('SELECT * FROM entrevistas ORDER BY fechaCreacion DESC').all();
    res.json(entrevistas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const entrevista = db.prepare('SELECT * FROM entrevistas WHERE id = ?').get(req.params.id);
    if (!entrevista) return res.status(404).json({ error: 'Entrevista not found' });
    res.json(entrevista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { titulo, stakeholderId, descripcion, preguntas, respuestas, fecha, notas } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO entrevistas (id, titulo, stakeholderId, descripcion, preguntas, respuestas, fecha, notas, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, titulo, stakeholderId || null, descripcion || null, preguntas || null, respuestas || null, fecha || null, notas || null, now, now);

    res.status(201).json({ id, titulo, stakeholderId, descripcion, preguntas, respuestas, fecha, notas, fechaCreacion: now, fechaActualizacion: now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { titulo, stakeholderId, descripcion, preguntas, respuestas, fecha, notas } = req.body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE entrevistas 
      SET titulo = ?, stakeholderId = ?, descripcion = ?, preguntas = ?, respuestas = ?, fecha = ?, notas = ?, fechaActualizacion = ?
      WHERE id = ?
    `).run(titulo, stakeholderId || null, descripcion || null, preguntas || null, respuestas || null, fecha || null, notas || null, now, req.params.id);

    if (result.changes === 0) return res.status(404).json({ error: 'Entrevista not found' });
    res.json(db.prepare('SELECT * FROM entrevistas WHERE id = ?').get(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM entrevistas WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Entrevista not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
