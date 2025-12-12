const ldap = require("ldapjs");

function mapLdapErrorToReason(err) {
  if (!err) return undefined;
  // ldapjs normalmente usa nomes como InvalidCredentialsError
  if (err.name === "InvalidCredentialsError") return "INVALID_PASSWORD";
  if (err.name === "NoSuchObjectError") return "USER_NOT_FOUND";
  const msg = String(err.message || "").toLowerCase();
  if (msg.includes("invalid credentials")) return "INVALID_PASSWORD";
  if (msg.includes("no such object") || msg.includes("does not exist")) return "USER_NOT_FOUND";
  return "LDAP_ERROR";
}

/**
 * Autentica um DN/senha via LDAP bind.
 * Retorna um objeto padronizado para facilitar testes e mapeamento de mensagens.
 */
function authenticateWithDNFactory({
  url = "ldap://172.32.14.1:389",
  timeout = 5000,
  connectTimeout = 10000,
  createClient = ldap.createClient,
} = {}) {
  return function authenticateWithDN(userDN, password) {
    return new Promise((resolve) => {
      const client = createClient({ url, timeout, connectTimeout });

      client.on("error", (err) => {
        try {
          client.unbind();
        } catch (_) {}
        resolve({ ok: false, reason: mapLdapErrorToReason(err) });
      });

      client.bind(userDN, password, (err) => {
        const reason = mapLdapErrorToReason(err);
        try {
          client.unbind();
        } catch (_) {}
        if (err) return resolve({ ok: false, reason });
        return resolve({ ok: true });
      });
    });
  };
}

module.exports = { authenticateWithDNFactory, mapLdapErrorToReason };


