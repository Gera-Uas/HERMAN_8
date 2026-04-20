import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// List all stakeholders
router.get('/', (req, res) => {
  try {
    const stakeholders = db.prepare('SELECT * FROM stakeholders ORDER BY fechaCreacion DESC').all();
    res.json(stakeholders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stakeholder by ID
router.get('/:id', (req, res) => {
  try {
    const stakeholder = db.prepare('SELECT * FROM stakeholders WHERE id = ?').get(req.params.id);
    if (!stakeholder) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }
    res.json(stakeholder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create stakeholder
router.post('/', (req, res) => {
  try {
    const { nombre, rol, email, organizacion } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO stakeholders (id, nombre, rol, email, organizacion, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, nombre, rol || null, email || null, organizacion || null, now, now);

    res.status(201).json({
      id,
      nombre,
      rol,
      email,
      organizacion,
      fechaCreacion: now,
      fechaActualizacion: now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update stakeholder
router.put('/:id', (req, res) => {
  try {
    const { nombre, rol, email, organizacion } = req.body;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE stakeholders 
      SET nombre = ?, rol = ?, email = ?, organizacion = ?, fechaActualizacion = ?
      WHERE id = ?
    `);

    const result = stmt.run(nombre, rol || null, email || null, organizacion || null, now, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }

    const stakeholder = db.prepare('SELECT * FROM stakeholders WHERE id = ?').get(req.params.id);
    res.json(stakeholder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete stakeholder
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM stakeholders WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
