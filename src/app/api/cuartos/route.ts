import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {         
      direccion,
      fotoUrlcuarto,    
      descripcion,      
      condiciones,       
      precio,         
      tipoCuarto,      
      estadoCuarto,
      ubicacionId,
      email
    } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email no proporcionado' }, { status: 400 });
    }

    const usuario = await db.usuario.findUnique({
      where: {
        email: email
      }
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const nuevoCuarto = await db.cuarto.create({
      data: {
        direccion,
        fotoUrlcuarto,    
        descripcion,      
        condiciones,       
        precio,
        tipoCuarto,      
        estadoCuarto,
        propietarioId: usuario.id,
        ubicacionId    // Asegúrate de que este valor es proporcionado correctamente
      },
    });

    return NextResponse.json(nuevoCuarto);

  } catch (error) {
    console.error('Error al crear el cuarto:', error);
    return NextResponse.json({ message: 'Error al crear el cuarto' }, { status: 500 });
  }
}
