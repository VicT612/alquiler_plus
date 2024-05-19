// api/inicio.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, contrasena } = body;
    const existingUser = await db.usuario.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json({ rol: "ANONIMO" });
    }
    if (contrasena !== existingUser.contrasena) {
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }
    return NextResponse.json(existingUser);
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
