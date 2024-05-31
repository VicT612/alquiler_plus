import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nombre, apellido, direccion, ciudad, contrasena, telefono, fotoUrl, fechaNacimiento, ci, ubicacionId } = body;

    // Validation schema
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      nombre: Yup.string().required(),
      apellido: Yup.string().required(),
      direccion: Yup.string().required(),
      ciudad: Yup.string().required(),
      contrasena: Yup.string().min(8).required(),
      telefono: Yup.string().matches(/^[0-9]+$/, 'El teléfono solo debe contener números').required(),
      fechaNacimiento: Yup.date()
        .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Debe ser mayor de 18 años')
        .required(),
      ci: Yup.string().matches(/^[0-9]+$/, 'El CI solo debe contener números').required(),
    });

    await schema.validate(body);

    const existingUserByEmail = await db.usuario.findUnique({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json({ message: "El correo electrónico ya está registrado" }, { status: 400 });
    }

    const existingUserByPhone = await db.usuario.findUnique({ where: { telefono } });
    if (existingUserByPhone) {
      return NextResponse.json({ message: "El teléfono ya está registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUser = await db.usuario.create({
      data: {
        email,
        nombre,
        apellido,
        direccion,
        ciudad,
        contrasena: hashedPassword,
        telefono,
        fotoUrl,
        fechaNacimiento,
        ci,
        rol: 'PROPIETARIO',
        ubicacionId, // Asegúrate de registrar el `ubicacionId` aquí
      }
    });

    return NextResponse.json({ message: "Arrendador registrado exitosamente", newUser });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
