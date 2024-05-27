import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { latitud, longitud, calle, barrio, ciudad, provincia, Departamento, pais, beneficios } = body;

    console.log('Datos recibidos del cliente:', body);

    // Validar que todos los datos necesarios están presentes y son del tipo correcto
    if (
      !latitud || !longitud || !calle || !barrio || !ciudad || !provincia || !Departamento || !pais ||
      isNaN(parseFloat(latitud)) || isNaN(parseFloat(longitud))
    ) {
      return NextResponse.json({ error: 'Faltan datos necesarios o los datos son incorrectos' }, { status: 400 });
    }

    const nuevaUbicacion = await db.ubicacion.create({
      data: {
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        calle: String(calle),
        barrio: String(barrio),
        ciudad: String(ciudad),
        provincia: String(provincia),
        Departamento: String(Departamento),
        pais: String(pais),
        beneficios: String(beneficios),
      },
    });

    return NextResponse.json({ id: nuevaUbicacion.id }, { status: 201 });
    console.log('Datos recibidos del cliente:');
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

