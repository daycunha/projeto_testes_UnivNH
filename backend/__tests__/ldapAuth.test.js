const { authenticateWithDNFactory, mapLdapErrorToReason } = require("../services/ldapAuth");

describe("services/ldapAuth", () => {
  test("CT-05: quando bind falha, unbind é chamado e retorna ok=false", async () => {
    const unbind = jest.fn();
    const bind = jest.fn((_dn, _pwd, cb) => cb({ name: "InvalidCredentialsError", message: "Invalid Credentials" }));
    const on = jest.fn();

    const createClient = () => ({ bind, unbind, on });
    const authenticateWithDN = authenticateWithDNFactory({ createClient });

    const res = await authenticateWithDN("julia.diniz@nutrihouse.intra", "senhaerrada");
    expect(res.ok).toBe(false);
    expect(res.reason).toBe("INVALID_PASSWORD");
    expect(unbind).toHaveBeenCalled();
  });

  test("mapLdapErrorToReason cobre USER_NOT_FOUND", () => {
    expect(mapLdapErrorToReason({ name: "NoSuchObjectError", message: "No such object" })).toBe("USER_NOT_FOUND");
  });
});


