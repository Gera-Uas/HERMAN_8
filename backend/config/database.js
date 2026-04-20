import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');
const dbPath = path.join(dataDir, 'herman.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
export function initializeDatabase() {
  // Stakeholder table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stakeholders (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      rol TEXT,
      email TEXT,
      organizacion TEXT,
      fechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Funcion table
  db.exec(`
    CREATE TABLE IF NOT EXISTS funciones (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      prioridad TEXT,
      estado TEXT,
      responsableId TEXT,
      fechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (responsableId) REFERENCES stakeholders(id) ON DELETE SET NULL
    )
  `);

  // HistoriaUsuario table
  db.exec(`
    CREATE TABLE IF NOT EXISTS historias_usuario (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      aceptacion TEXT,
      prioridad TEXT,
      estimacion INTEGER,
      estado TEXT,
      funcionId TEXT,
      fechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (funcionId) REFERENCES funciones(id) ON DELETE SET NULL
    )
  `);

  // AnalisisDocumento table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analisis_documentos (
      id TEXT PRIMARY KEY,
      tipoDocumento TEXT,
      nombreDocumento TEXT NOT NULL,
      fuente TEXT,
      autor TEXT,
      fechaDocumento TEXT,
      version TEXT,
      proposito TEXT,
      extractos TEXT,
      requisitos TEXT,
      restricciones TEXT,
      suposiciones TEXT,
      riesgos TEXT,
      fechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Encuesta table
  db.exec(`
    CREATE TABLE IF NOT EXISTS encuestas (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      preguntas TEXT,
      respuestas TEXT,
      fechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Entrevista table
  db.exec(`
    CREATE TABLE IF NOT EXISTS entrevistas (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      stakeholderId TEXT,
      descripcion TEXT,
      preguntas TEXT,
      respuestas TEXT,
      fecha TEXT,
      notas TEXT,
      fechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stakeholderId) REFERENCES stakeholders(id) ON DELETE SET NULL
    )
  `);

  // FocusGroup table
  db.exec(`
    CREATE TABLE IF NOT EXISTS focus_groups (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      participantes TEXT,
      temas TEXT,
      resultados TEXT,
      fecha TEXT,
      notas TEXT,
      fechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // SeguimientoTransaccional table
  db.exec(`
    CREATE TABLE IF NOT EXISTS seguimientos_transaccionales (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      transacciones TEXT,
      actores TEXT,
      flujo TEXT,
      excepciones TEXT,
      fechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Junction table for AnalisisDocumento-Stakeholder
  db.exec(`
    CREATE TABLE IF NOT EXISTS analisis_documento_stakeholders (
      analisisDocumentoId TEXT NOT NULL,
      stakeholderId TEXT NOT NULL,
      PRIMARY KEY (analisisDocumentoId, stakeholderId),
      FOREIGN KEY (analisisDocumentoId) REFERENCES analisis_documentos(id) ON DELETE CASCADE,
      FOREIGN KEY (stakeholderId) REFERENCES stakeholders(id) ON DELETE CASCADE
    )
  `);

  // Junction table for AnalisisDocumento-Funcion
  db.exec(`
    CREATE TABLE IF NOT EXISTS analisis_documento_funciones (
      analisisDocumentoId TEXT NOT NULL,
      funcionId TEXT NOT NULL,
      PRIMARY KEY (analisisDocumentoId, funcionId),
      FOREIGN KEY (analisisDocumentoId) REFERENCES analisis_documentos(id) ON DELETE CASCADE,
      FOREIGN KEY (funcionId) REFERENCES funciones(id) ON DELETE CASCADE
    )
  `);

  console.log('✓ Database initialized');
}
