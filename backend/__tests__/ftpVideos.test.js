const { createListarVideosFTP, defaultVideoFilter } = require("../services/ftpVideos");

describe("services/ftpVideos", () => {
  test("defaultVideoFilter aceita extensões de vídeo e rejeita outras", () => {
    expect(defaultVideoFilter("a.mp4")).toBe(true);
    expect(defaultVideoFilter("b.MKV")).toBe(true);
    expect(defaultVideoFilter("c.txt")).toBe(false);
  });

  test("createListarVideosFTP lista e filtra apenas vídeos", async () => {
    const access = jest.fn();
    const cd = jest.fn();
    const list = jest.fn(async () => [
      { isFile: true, name: "a.mp4" },
      { isFile: true, name: "b.txt" },
      { isFile: false, name: "dir" },
      { isFile: true, name: "c.mkv" },
    ]);
    const close = jest.fn();
    const clientFactory = () => ({ ftp: { verbose: false }, access, cd, list, close });

    const listarVideos = createListarVideosFTP({ clientFactory, host: "h", user: "u", password: "p", path: "x" });
    const res = await listarVideos();

    expect(access).toHaveBeenCalled();
    expect(cd).toHaveBeenCalledWith("x");
    expect(res).toEqual(["a.mp4", "c.mkv"]);
    expect(close).toHaveBeenCalled();
  });
});


