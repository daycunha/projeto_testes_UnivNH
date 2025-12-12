const { createApp } = require("./app");
const { authenticateWithDNFactory } = require("./services/ldapAuth");
const { createListarVideosFTP } = require("./services/ftpVideos");

// Dependências reais (em testes, usamos mocks via createApp)
const authenticateWithDN = authenticateWithDNFactory();
const listarVideos = createListarVideosFTP();

const app = createApp({ authenticateWithDN, listarVideos });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
