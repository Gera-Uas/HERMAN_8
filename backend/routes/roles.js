import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const roles = db.prepare('SELECT * FROM roles ORDER BY fechaCreacion DESC').all();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const role = db.prepare('SELECT * FROM roles WHERE id = ?').get(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { nombre, descripcion, nivel } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO roles (id, nombre, descripcion, nivel, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, nombre, descripcion || null, nivel || null, now, now);

    res.status(201).json({
      id,
      nombre,
      descripcion,
      nivel,
      fechaCreacion: now,
      fechaActualizacion: now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM roles WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const { nombre, descripcion, nivel } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE roles
      SET nombre = ?, descripcion = ?, nivel = ?, fechaActualizacion = ?
      WHERE id = ?
    `).run(
      nombre ?? existing.nombre,
      descripcion !== undefined ? descripcion : existing.descripcion,
      nivel !== undefined ? nivel : existing.nivel,
      now,
      req.params.id
    );

    const role = db.prepare('SELECT * FROM roles WHERE id = ?').get(req.params.id);
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM roles WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;