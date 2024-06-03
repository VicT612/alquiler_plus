import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: 'ID no proporcionado' }, { status: 400 });
  }

  try {
    const cuarto = await db.cuarto.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        propietario: true
      }
    });

    if (!cuarto) {
      return NextResponse.json({ message: 'Cuarto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(cuarto);
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
