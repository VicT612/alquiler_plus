import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Asegúrate de que la importación esté correcta

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, contenido, cuartoId, estrellas } = body;

    // Verificar si el usuario existe
    const existingUser = await db.usuario.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si el propietario existe
    const existingPropietario = await db.cuarto.findUnique({ where: { id: cuartoId } });
    if (!existingPropietario) {
      return NextResponse.json({ message: 'Propietario no encontrado' }, { status: 404 });
    }

    // Crear el comentario asociado al usuario, propietario y cuarto
    const nuevoComentario = await db.comentario.create({
      data: {
        contenido,
        usuarioId: existingUser.id,
        propietarioId: existingPropietario.propietarioId,
        cuartoId,
        estrellas
      },
    });

    return NextResponse.json(nuevoComentario);
  } catch (error) {
    console.error('Error al agregar el comentario:', error);
    return NextResponse.json({ message: 'Error al agregar el comentario' }, { status: 500 });
  }
}
