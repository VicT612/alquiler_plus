import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, contrasena } = body;

        const existingUser = await db.usuario.findUnique({ where: { email } });
        if (!existingUser) {
            return NextResponse.json({ message: "Usuario no encontrado", rol: "ANONIMO" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(contrasena, existingUser.contrasena);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
        }

        const token = jwt.sign({ id: existingUser.id, rol: existingUser.rol }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return NextResponse.json({ token, rol: existingUser.rol, user: existingUser });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}
