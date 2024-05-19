import React from "react";
import { useRouter } from "next/navigation";

interface Cuarto {
  id: number;
  direccion: string;
  fotoUrlcuarto: string;
  precio: number;
  caracteristicas: string;
  tipo: string;
  cantidadHabitaciones: number;
  estado: string;
  propietario: {
    nombre: string;
  };
}

interface Props {
  cuarto: Cuarto;
}

function Card({ cuarto }: Props) {
  const router = useRouter();
  const handleCardClick = () => {
    // Almacenar los datos del cuarto en localStorage
    localStorage.setItem("selectedRoom", JSON.stringify(cuarto));
    router.push(`/AboutRoom`)
  };

  return (
    <div
      className="rounded overflow-hidden shadow-lg m-4 cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        className="w-full"
        src={cuarto.fotoUrlcuarto}
        alt="Foto del cuarto"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{cuarto.direccion}</div>
        <p>Precio: Bs {cuarto.precio}</p>
        <p>Estado: {cuarto.estado}</p>
      </div>
    </div>
  );
}

export default Card;
