import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import CarouselCard from "../components/CarouselCard";
import carouselData from "../data/carouselData";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import SetaLeft from "../assets/images/left.png";
import SetaRight from "../assets/images/right.png";


const PAGE_SIZE = 6;

const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const Home = () => {
  const [username, setUsername] = useState("Usuário");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored && stored !== "undefined") setUsername(stored);
  }, []);

  const pages = chunk(carouselData, PAGE_SIZE);
  const total = pages.length;
  const current = pages[page] ?? [];

  const handleCardClick = (id) => {
    console.log("Clicou no card:", id);
    navigate(`/video/${id}`);
  };

  return (
    <main className="bg-[#FAF9F7] flex flex-col min-h-screen pt-[70px] font-sans">
      <Header username={username} />

      <section className="relative flex flex-col justify-center items-center flex-1">
        <div className="w-full max-w-[1150px] px-6 flex flex-col justify-between h-full pt-10">
          <Outlet />

          {/* Grid de cards e navegação */}
          <div className="relative w-full flex items-center justify-center mt-4">

            {/* Seta esquerda */}
          <button
            onClick={() => setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : total - 1))}
            disabled={page === 0}
            aria-label="Voltar para a página anterior"
            className="w-12 h-12 flex items-center justify-center bg-transparent disabled:cursor-not-allowed mx-2"
          >
            <svg className="w-6 h-6 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l-7-7 7-7"></path>
              <path d="M5 12h14"></path>
            </svg>
          </button>


            {/* Grid de cards */}
            <div className="grid grid-cols-3 gap-6">
              {current.map((item) => (
                <div key={item.id} className="flex justify-center ">
                  <CarouselCard
                    id={item.id}
                    title={item.title}
                    icon={item.image}
                    description={item.description}
                    onClick={() => handleCardClick(item.id)}
                    className="h-[180px]"
                  />
                </div>
              ))}
            </div>

            {/* Seta direita */}
            <button
              onClick={() => setPage((prevPage) => (prevPage < total - 1 ? prevPage + 1 : 0))}
              disabled={page === total - 1}
              aria-label="Avançar para a próxima página"
              className="w-12 h-12 flex items-center justify-center bg-transparent disabled:cursor-not-allowed mx-2"
            >
              <svg className="w-6 h-6 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5l7 7-7 7"></path>
                <path d="M5 12h14"></path>
              </svg>
            </button>          </div>

          {/* Paginação */}
          <div className="w-full h-[100px] flex items-center justify-center">
            <div className="paginacao-container space-x-2">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Ir para a página ${i + 1}`}
                  className={`w-10 h-10 min-w-[40px] text-center flex items-center justify-center rounded-md font-medium
                    ${page === i
                      ? "bg-yellow-500 text-white border-yellow-500 shadow-md"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </main>
  );
};

export default Home;
