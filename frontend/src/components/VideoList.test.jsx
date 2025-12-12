import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoList from "./VideoList";

describe("VideoList", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("carrega e lista vídeos vindos da API", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ videos: ["a.mp4", "b.mkv"] }),
    });

    render(<VideoList />);

    expect(await screen.findByRole("button", { name: "a.mp4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "b.mkv" })).toBeInTheDocument();
  });

  test("ao clicar em um vídeo, monta a URL com base + filename (regressão)", async () => {
    process.env.REACT_APP_VIDEO_BASE_URL = "http://videos.local";
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ videos: ["Treino 01.mp4"] }),
    });

    render(<VideoList />);
    await userEvent.click(await screen.findByRole("button", { name: "Treino 01.mp4" }));

    expect(await screen.findByText(/reproduzindo/i)).toBeInTheDocument();
    expect(screen.getByText(/treino%2001\.mp4/i)).toBeInTheDocument();
  });
});


