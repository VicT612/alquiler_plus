'use client'
import React from "react";

interface Comentario {
  id: number;
  contenido: string;
  calificacion: number;
  usuario: {
    nombre: string;
  };
  fechaRegistro: Date;
}

interface Props {
  comentario: Comentario;
}

function CommentCard({ comentario }: Props) {
  return (
    <div className="rounded overflow-hidden shadow-lg bg-white text-black m-4 max-w-md w-full sm:max-w-xs sm:w-full md:max-w-sm md:w-1/2 lg:w-1/3 xl:w-1/4">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-4">{comentario.usuario.nombre}</div>
        <div className="flex mb-4">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={index < comentario.calificacion ? "text-yellow-500" : "text-gray-400"}
            >
              &#9733;
            </span>
          ))}
        </div>
        <p className="text-gray-700 mb-4">{comentario.contenido}</p>
        <p className="text-sm text-gray-500">{new Date(comentario.fechaRegistro).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default CommentCard;
