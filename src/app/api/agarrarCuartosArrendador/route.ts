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