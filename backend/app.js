const express = require("express");
const cors = require("cors");

/**
 * Cria a aplicação Express com dependências injetáveis (facilita mocks em testes).
 *
 * @param {object} deps
 * @param {(userDN: string, password: string) => Promise<{ ok: boolean, reason?: 'INVALID_PASSWORD' | 'USER_NOT_FOUND' | 'LDAP_ERROR' }>} deps.authenticateWithDN
 * @param {() => Promise<string[]>} deps.listarVideos
 */
function createApp(deps = {}) {
  const {
    authenticateWithDN = async () => ({ ok: false, reason: "LDAP_ERROR" }),
    listarVideos = async () => [],
  } = deps;

  const app = express();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(express.json());

  // Healthcheck simples (ajuda em testes/manutenção)
  app.get("/health", (_req, res) => res.json({ ok: true }));

  /**
   * POST /authenticate
   * Body: { userDN, password }
   *
   * Para suportar os CTs do documento, retornamos mensagens distintas
   * (em produção, isso pode ser endurecido por segurança).
   */
  app.post("/authenticate", async (req, res) => {
    const { userDN, password } = req.body || {};

    if (!userDN || !password) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    try {
      const result = await authenticateWithDN(userDN, password);

      if (result?.ok) {
        const username = String(userDN).split("@")[0];
        return res.json({ message: "Autenticação bem-sucedida", username });
      }

      // Mapeamento de erros para os CT-01 / CT-02 (mensagens do frontend)
      if (result?.reason === "INVALID_PASSWORD") {
        return res.status(401).json({ message: "Senha incorreta" });
      }
      if (result?.reason === "USER_NOT_FOUND") {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }

      return res.status(401).json({ message: "Falha na autenticação" });
    } catch (err) {
      return res.status(500).json({ message: "Erro interno" });
    }
  });

  /**
   * GET /api/videos
   * Retorna: { videos: string[] }
   */
  app.get("/api/videos", async (_req, res) => {
    try {
      const lista = await listarVideos();
      return res.json({ videos: lista });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao listar vídeos no servidor." });
    }
  });

  return app;
}

module.exports = { createApp };


