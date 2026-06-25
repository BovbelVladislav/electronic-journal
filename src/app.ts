// src/app.ts
import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./database/data-source";
import 'reflect-metadata';


// Роуты (если у тебя нет реальных роутов — эти заглушки безопасны)
import subjectRouter from "./routes/subjectRoutes";
import groupRouter from "./routes/groupRoutes";
import authRouter from "./routes/auth";
const app = express();

app.use(bodyParser.json());

// Health
app.get("/health", (req, res) => {
  const dbStatus = AppDataSource.isInitialized ? "ok" : "not_initialized";
  res.json({ status: "ok", db: dbStatus });
});

// API
app.use("/api/subjects", subjectRouter);
app.use("/api/groups", groupRouter);
app.use("/api/auth", authRouter);

export default app;
