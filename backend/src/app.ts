import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || './uploads')));
app.use('/api', routes);
app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
