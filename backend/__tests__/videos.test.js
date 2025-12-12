const request = require("supertest");
const { createApp } = require("../app");

describe("GET /api/videos", () => {
  test("retorna lista de vídeos", async () => {
    const app = createApp({
      listarVideos: async () => ["a.mp4", "b.mkv"],
    });

    const res = await request(app).get("/api/videos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ videos: ["a.mp4", "b.mkv"] });
  });

  test("erro no FTP -> 500", async () => {
    const app = createApp({
      listarVideos: async () => {
        throw new Error("FTP down");
      },
    });

    const res = await request(app).get("/api/videos");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro ao listar vídeos no servidor." });
  });
});


