import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import CommentCard from "./cardComentarios";
import './pagestyle.css';

interface Comment {
  id: number;
  usuarioNombre: string;
  contenido: string;
  estrellas: number;
  fechaRegistro: Date;
}

const AboutRoom: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedRoomId = localStorage.getItem('cuartoId');
    if (storedRoomId) {
      fetchRoomData(storedRoomId);
      fetchComments(parseInt(storedRoomId));
    }
  }, []);

  const fetchRoomData = async (id: string) => {
    try {
      const response = await axios.get(`/api/tenerCuartoId/?id=${id}`);
      setSelectedRoom(response.data);
    } catch (error) {
      console.error("Error al obtener datos del cuarto:", error);
    }
  };

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCommentContent(event.target.value);
  };

  const handleRatingChange = (newRating: number): void => {
    setRating(newRating);
  };

  const sendComment = async (): Promise<void> => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;
      const email = user.email;
      const cuartoId = localStorage.getItem('cuartoId');

      if (!email || !userId || !cuartoId) {
        throw new Error("Datos insuficientes");
      }

      const response = await axios.post("/api/agregar-comentario", {
        email,
        contenido: commentContent,
        estrellas: rating,
        cuartoId: parseInt(cuartoId),
        usuarioId: userId
      });
      console.log("Respuesta de la API:", response.data);
      console.log("Comentario enviado exitosamente");
      setCommentContent("");
      setRating(0);
      fetchComments(parseInt(cuartoId));
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    sendComment();
  };

  const fetchComments = async (cuartoId: number): Promise<void> => {
    try {
      const response = await axios.post('/api/agarrarComentario', {
        cuartoId
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  if (!selectedRoom) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>
      <button className="button" onClick={() => setSelectedRoom(null)}>Volver</button>
      <h1 className="title">Detalles del Cuarto</h1>
      <div className="image-container">
        <img className="image" src={selectedRoom.fotoUrlcuarto} alt="Foto del cuarto" />
      </div>
      <div className="details-comments-container">
        <div className="details-container">
          <div className="details-card">
            <p className="bold">Dirección: {selectedRoom.direccion}</p>
            <p className="mb-2">Precio: {selectedRoom.precio}</p>
            <p className="mb-2">Descripción: {selectedRoom.descripcion}</p>
            <p className="mb-2">Condiciones: {selectedRoom.condiciones}</p>
            <p className="mb-2">Tipo: {selectedRoom.tipoCuarto}</p>
            <p className="mb-2">Estado: {selectedRoom.estadoCuarto}</p>
            <p className="mb-2">Propietario: {selectedRoom.propietario.nombre}</p>
          </div>
          <button className="button" onClick={() => console.log("Chatea con el arrendador")}>
            Chatea con el arrendador
          </button>
        </div>
        <div className="comments-rating">
          <form onSubmit={handleFormSubmit} className="form">
            <div className="form-group">
              <input
                type="text"
                value={commentContent}
                onChange={handleCommentChange}
                placeholder="Escribe tu comentario aquí..."
                className="input"
              />
              <Rating rating={rating} onChange={handleRatingChange} />
            </div>
            <button type="submit" className="button">
              Enviar Comentario
            </button>
          </form>
          <div className="comments-section">
            <h2 className="comments-title">Comentarios</h2>
            <div className="comments-list">
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id} className="comment-item">
                    <CommentCard comentario={comment} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Rating: React.FC<{ rating: number; onChange: (newRating: number) => void }> = ({ rating, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-yellow-500 cursor-pointer" : "text-gray-500 cursor-pointer"}
          onClick={() => onChange(star)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default AboutRoom;
