import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('q');
    const criteria = url.searchParams.getAll('criteria');
  
    if (!searchQuery || criteria.length === 0) {
      return NextResponse.json({ message: "Query o criterio no proporcionado" }, { status: 400 });
    }
  
    try {
      const whereConditions: any[] = criteria.map(criterion => {
        switch (criterion) {
          case 'precio':
            return { precio: { equals: Number(searchQuery) } };
          case 'direccion':
            return { direccion: { contains: searchQuery, mode: 'insensitive' } };
          case 'estadoCuarto':
            return { estadoCuarto: { equals: searchQuery } };
          case 'nombrePropietario':
            return {
              propietario: {
                OR: [
                  { nombre: { contains: searchQuery, mode: 'insensitive' } },
                  { apellido: { contains: searchQuery, mode: 'insensitive' } }
                ]
              }
            };
          default:
            return {
              OR: [
                { descripcion: { contains: searchQuery, mode: 'insensitive' } },
                { direccion: { contains: searchQuery, mode: 'insensitive' } }
              ]
            };
        }
      });
  
      let whereCondition: any = {};
      if (criteria.includes('nombrePropietario')) {
        whereCondition.AND = whereConditions;
      } else {
        whereCondition = whereConditions.reduce((acc, condition) => ({ ...acc, ...condition }), {});
      }
  
      const cuartos = await db.cuarto.findMany({
        where: whereCondition,
        include: {
          propietario: true
        }
      });
  
      return NextResponse.json(cuartos);
    } catch (error) {
      console.error('Error al buscar cuartos:', error);
      return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
  }
  