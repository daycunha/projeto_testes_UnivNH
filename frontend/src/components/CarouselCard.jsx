import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"

const CarouselCard = ({ id, title, icon, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof onClick === "function") return onClick();
    navigate(`/video/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center 
          bg-[linear-gradient(135deg,_#B95758,_#e14d3a)]   
           text-white shadow-2xl font-poppins text-1xl rounded-lg w-full max-w-sm h-25 p-5 m-1">
      <div className="flex items-center space-x-1">
        <img
          src={icon}
          alt={title}
          className="w-24 h-24 object-contain"
        />
        <h1 className="text-2x1 font-bold">{title}</h1>
      </div>
    </button>
  );
};

export default CarouselCard;

