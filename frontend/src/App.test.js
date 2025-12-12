import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./components/Login";

test("renderiza a tela de login na rota /", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Login />
    </MemoryRouter>
  );
  expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
});
