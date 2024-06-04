import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const { cuartoId } = await req.json();

  if (!cuartoId) {
    return NextResponse.json({ error: 'cuartoId es requerido' }, { status: 400 });
  }

  try {
    const comentarios = await db.comentario.findMany({
      where: { cuartoId: parseInt(cuartoId) },
      orderBy: [
        { fechaRegistro: 'desc' },
        { estrellas: 'desc' }
      ]
    });

    const usuarioIds = comentarios.map(comentario => comentario.usuarioId);

    const usuarios = await db.usuario.findMany({
      where: { id: { in: usuarioIds } },
      select: { id: true, nombre: true }
    });

    const comentariosConUsuarios = comentarios.map(comentario => {
      const usuario = usuarios.find(u => u.id === comentario.usuarioId);
      return {
        ...comentario,
        usuarioNombre: usuario ? usuario.nombre : 'Desconocido'
      };
    });

    return NextResponse.json(comentariosConUsuarios, { status: 200 });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 });
  }
}

