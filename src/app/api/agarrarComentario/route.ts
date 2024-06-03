import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cuartos = await db.cuarto.findMany({
      include: {
        propietario: true 
      }
    });

    return NextResponse.json(cuartos);
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { cuartoId } = await request.json();

  try {
    const comentarios = await db.comentario.findMany({
      where: {
        cuartoId: parseInt(cuartoId)
      }
    });

    return NextResponse.json(comentarios);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return NextResponse.error();
  }
}