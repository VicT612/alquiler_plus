// types.ts
export interface User {
    id: number;
    nombre: string;
    email: string;
    fotoUrl: string;
    rol: string;
  }
  
  export interface Cuarto {
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
  