import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const {
      email,
      nombre,
      apellido,  // Asegúrate de que este campo sea recogido
      contrasena,
      telefono,
      direccion,
      ciudad,
      fotoUrl,
      fechaNacimiento,
      ci
    } = body;
  
    const user = await db.usuario.create({
      data: {
        email,
        nombre,
        apellido, // Asegúrate de que este campo sea incluido aquí
        contrasena,
        telefono,
        direccion,
        ciudad,
        fotoUrl,
        fechaNacimiento,
        ci
      }
    });
  
    return NextResponse.json(user);
  }
  