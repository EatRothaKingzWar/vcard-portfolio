import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100kb' }));

// API routes
app.use('/api/contact', contactRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'neon', time: new Date().toISOString() });
});

// Serve the static frontend from the project root
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Boot
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to init DB:', err);
    process.exit(1);
  });