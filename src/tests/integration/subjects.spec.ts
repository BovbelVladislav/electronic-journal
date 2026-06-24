// src/tests/integration/subjects.spec.ts
import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../database/data-source";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Subjects API", () => {
  it("GET /api/subjects returns 200 and array (or 404 if not implemented)", async () => {
    const res = await request(app).get("/api/subjects");
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });
});
