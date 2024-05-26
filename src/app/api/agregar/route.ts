// src/app/api/agregarArrendador/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            email,
            nombre,
            apellido,
            contrasena,
            telefono,
            direccion,
            ciudad,
            fotoUrl,
            fechaNacimiento,
            ci
        } = body;

        // Verificar si el teléfono o email ya existen
        const existingUserByPhone = await db.usuario.findUnique({ where: { telefono } });
        const existingUserByEmail = await db.usuario.findUnique({ where: { email } });
        if (existingUserByPhone) {
            return NextResponse.json({ message: "El teléfono ya está registrado" }, { status: 400 });
        }
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
                telefono,
                direccion,
                ciudad,
                fotoUrl,
                fechaNacimiento,
                ci,
                rol: 'ARRENDADOR'
            }
        });

        return NextResponse.json({ message: "Arrendador registrado exitosamente", newUser });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}
