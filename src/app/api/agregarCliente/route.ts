// src/app/api/agregarCliente/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nombre, apellido, contrasena, fotoUrl } = body;

    // Validation schema
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      nombre: Yup.string().matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nombre solo debe contener letras').required(),
      apellido: Yup.string().matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Apellido solo debe contener letras').required(),
      contrasena: Yup.string().min(8).required(),
    });

    await schema.validate(body);

    const existingUserByEmail = await db.usuario.findUnique({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json({ message: "El correo electrónico ya está registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUser = await db.usuario.create({
      data: {
        email,
        nombre,
        apellido,
        contrasena: hashedPassword,
        fotoUrl,
      }
    });

    return NextResponse.json({ message: "Cliente registrado exitosamente", newUser });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
