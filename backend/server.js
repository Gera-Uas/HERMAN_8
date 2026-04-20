import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database.js';

// Import routes
import stakeholdersRouter from './routes/stakeholders.js';
import funcionesRouter from './routes/funciones.js';
import historiasRouter from './routes/historias-usuario.js';
import documentosRouter from './routes/analisis-documentos.js';
import encuestasRouter from './routes/encuestas.js';
import entrevistasRouter from './routes/entrevistas.js';
import focusGroupsRouter from './routes/focus-groups.js';
import seguimientosRouter from './routes/seguimientos-transaccionales.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Routes
app.use('/api/entities/Stakeholder', stakeholdersRouter);
app.use('/api/entities/Funcion', funcionesRouter);
app.use('/api/entities/HistoriaUsuario', historiasRouter);
app.use('/api/entities/AnalisisDocumento', documentosRouter);
app.use('/api/entities/Encuesta', encuestasRouter);
app.use('/api/entities/Entrevista', entrevistasRouter);
app.use('/api/entities/FocusGroup', focusGroupsRouter);
app.use('/api/entities/SeguimientoTransaccional', seguimientosRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Backend server running on http://localhost:${PORT}`);
  console.log(`✓ API base URL: http://localhost:${PORT}/api/entities`);
});
