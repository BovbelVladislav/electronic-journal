// src/index.ts
import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import AppDataSource from './database/data-source'; // <- проверь этот путь и экспорт

dotenv.config();

const app = express();
app.use(express.json());

import routes from './routes';
app.use('/api', routes);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function start() {
  try {
    await AppDataSource.initialize(); // здесь AppDataSource должен быть объектом DataSource
    console.log('DataSource initialized');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to initialize DataSource', err);
    process.exit(1);
  }
}

start();
