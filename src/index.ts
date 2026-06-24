// src/index.ts
import app from "./app";
import { AppDataSource } from "./database/data-source";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  try {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

start();
