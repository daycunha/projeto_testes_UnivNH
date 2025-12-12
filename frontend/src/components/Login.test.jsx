import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login (CT-01 / CT-02 + técnicas)", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  test("CT-01: senha incorreta -> mostra 'Senha incorreta' e não navega", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Senha incorreta" }),
    });

    render(<Login />);
    await userEvent.type(screen.getByLabelText(/usuário/i), "julia.diniz");
    await userEvent.type(screen.getByLabelText(/senha/i), "senhaerrada");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/senha incorreta/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem("username")).toBeNull();
  });

  test("CT-02: credenciais válidas -> salva username e navega para /home", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Autenticação bem-sucedida", username: "julia.diniz" }),
    });

    render(<Login />);
    await userEvent.type(screen.getByLabelText(/usuário/i), "julia.diniz");
    await userEvent.type(screen.getByLabelText(/senha/i), "senhacorreta");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/home"));
    expect(localStorage.getItem("username")).toBe("julia.diniz");
  });

  test("Tabela de decisão (mensagens do backend -> mensagem exibida no frontend)", async () => {
    const casos = [
      { backendMsg: "Senha incorreta", esperado: /senha incorreta/i },
      { backendMsg: "Usuário não encontrado", esperado: /usuário não encontrado/i },
      { backendMsg: "Falha na autenticação", esperado: /falha na autenticação/i },
    ];

    for (const c of casos) {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: c.backendMsg }),
      });

      render(<Login />);
      await userEvent.type(screen.getByLabelText(/usuário/i), "julia.diniz");
      await userEvent.type(screen.getByLabelText(/senha/i), "x");
      await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

      expect(await screen.findByText(c.esperado)).toBeInTheDocument();
      cleanup();
    }
  });

  test("Transição de estados: ao submeter, entra em loading ('Entrando...') e depois volta", async () => {
    let resolver;
    global.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        })
    );

    render(<Login />);
    await userEvent.type(screen.getByLabelText(/usuário/i), "julia.diniz");
    await userEvent.type(screen.getByLabelText(/senha/i), "x");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByRole("button", { name: /entrando/i })).toBeDisabled();

    resolver({
      ok: false,
      json: async () => ({ message: "Falha na autenticação" }),
    });

    expect(await screen.findByText(/falha na autenticação/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeEnabled();
  });

  test("Partição de equivalência: falha de rede -> mostra 'Erro ao conectar ao servidor'", async () => {
    global.fetch.mockRejectedValueOnce(new Error("network"));

    render(<Login />);
    await userEvent.type(screen.getByLabelText(/usuário/i), "julia.diniz");
    await userEvent.type(screen.getByLabelText(/senha/i), "x");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/erro ao conectar ao servidor/i)).toBeInTheDocument();
  });

  test("Análise de valor limite: usuário só com espaços -> bloqueia e não chama API", async () => {
    render(<Login />);
    await userEvent.type(screen.getByLabelText(/usuário/i), "   ");
    await userEvent.type(screen.getByLabelText(/senha/i), "x");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/usuário obrigatório/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});


