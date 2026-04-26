import express from 'express';
import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// List all modulos
router.get('/', (req, res) => {
  try {
    const modulos = db.prepare('SELECT * FROM modulos ORDER BY fechaCreacion DESC').all();
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get modulo by ID
router.get('/:id', (req, res) => {
  try {
    const modulo = db.prepare('SELECT * FROM modulos WHERE id = ?').get(req.params.id);
    if (!modulo) {
      return res.status(404).json({ error: 'Modulo not found' });
    }
    res.json(modulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create modulo
router.post('/', (req, res) => {
  try {
    const { nombre, descripcion, version, estado, responsableId, funcionalidades } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO modulos (id, nombre, descripcion, version, estado, responsableId, funcionalidades, fechaCreacion, fechaActualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, nombre, descripcion || null, version || null, estado || 'planificacion', responsableId || null, funcionalidades || null, now, now);

    res.status(201).json({
      id,
      nombre,
      descripcion,
      version,
      estado,
      responsableId,
      funcionalidades,
      fechaCreacion: now,
      fechaActualizacion: now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update modulo
router.put('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM modulos WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Modulo not found' });
    }

    const { nombre, descripcion, version, estado, responsableId, funcionalidades } = req.body;
    const now = new Date().toISOString();
    const nextNombre = nombre ?? existing.nombre;
    const nextDescripcion = descripcion !== undefined ? descripcion : existing.descripcion;
    const nextVersion = version !== undefined ? version : existing.version;
    const nextEstado = estado !== undefined ? estado : existing.estado;
    const nextResponsableId = responsableId !== undefined ? responsableId : existing.responsableId;
    const nextFuncionalidades = funcionalidades !== undefined ? funcionalidades : existing.funcionalidades;

    const stmt = db.prepare(`
      UPDATE modulos 
      SET nombre = ?, descripcion = ?, version = ?, estado = ?, responsableId = ?, funcionalidades = ?, fechaActualizacion = ?
      WHERE id = ?
    `);

    stmt.run(
      nextNombre,
      nextDescripcion ?? null,
      nextVersion ?? null,
      nextEstado ?? 'planificacion',
      nextResponsableId ?? null,
      nextFuncionalidades ?? null,
      now,
      req.params.id
    );

    const modulo = db.prepare('SELECT * FROM modulos WHERE id = ?').get(req.params.id);
    res.json(modulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete modulo
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM modulos WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Modulo not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
