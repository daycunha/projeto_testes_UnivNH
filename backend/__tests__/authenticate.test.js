const request = require("supertest");
const { createApp } = require("../app");

describe("POST /authenticate", () => {
  test("CT-01: senha incorreta -> retorna 401 e mensagem 'Senha incorreta'", async () => {
    const app = createApp({
      authenticateWithDN: async () => ({ ok: false, reason: "INVALID_PASSWORD" }),
    });

    const res = await request(app).post("/authenticate").send({
      userDN: "julia.diniz@nutrihouse.intra",
      password: "senhaerrada",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Senha incorreta" });
  });

  test("CT-02: credenciais válidas -> retorna 200 e username", async () => {
    const app = createApp({
      authenticateWithDN: async () => ({ ok: true }),
    });

    const res = await request(app).post("/authenticate").send({
      userDN: "julia.diniz@nutrihouse.intra",
      password: "senhacorreta",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Autenticação bem-sucedida",
      username: "julia.diniz",
    });
  });

  test("Partição de equivalência: body inválido -> 400", async () => {
    const app = createApp({
      authenticateWithDN: async () => ({ ok: true }),
    });

    const res = await request(app).post("/authenticate").send({
      userDN: "",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Dados inválidos" });
  });
});


