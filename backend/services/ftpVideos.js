const FTPClient = require("basic-ftp");

function defaultVideoFilter(name) {
  return /\.(mp4|avi|mkv|mov)$/i.test(name);
}

function createListarVideosFTP({
  host = "192.168.1.4",
  user = "admin",
  password = "nutr1@10m3ga",
  path = "Universidade Nutrihouse/DOMANA/CDP",
  clientFactory = () => new FTPClient.Client(),
  videoFilter = defaultVideoFilter,
} = {}) {
  return async function listarVideosFTP() {
    const client = clientFactory();
    client.ftp.verbose = false;
    try {
      await client.access({ host, user, password, secure: false });
      await client.cd(path);
      const arquivos = await client.list();
      return arquivos
        .filter((item) => item.isFile)
        .map((item) => item.name)
        .filter(videoFilter);
    } finally {
      try {
        client.close();
      } catch (_) {}
    }
  };
}

module.exports = { createListarVideosFTP, defaultVideoFilter };


