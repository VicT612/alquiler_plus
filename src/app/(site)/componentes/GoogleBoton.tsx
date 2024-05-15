import React from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
  onClick: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        w-full 
        justify-center 
        rounded-md 
        bg-white 
        px-4 
        py-2 
        text-gray-500 
        shadow-sm 
        ring-1 
        ring-inset 
        ring-gray-300 
        hover:bg-red-50  // Cambio de color al hacer hover
        focus:outline-offset-0
        transition duration-300 ease-in-out  // Agregando transición
      "
    >
      <FcGoogle/>
    </button>
  );
};

export default GoogleButton;