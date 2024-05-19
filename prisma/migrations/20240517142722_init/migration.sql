-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROPIETARIO', 'USUARIO', 'ANONIMO', 'BANEADO');

-- CreateEnum
CREATE TYPE "TipoCuarto" AS ENUM ('GARZONIER', 'ESTUDIO', 'APARTAMENTO');

-- CreateEnum
CREATE TYPE "EstadoCuarto" AS ENUM ('DESOCUPADO', 'EN_CONTRATO', 'ALQUILADO');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "ciudad" TEXT,
    "fotoUrl" TEXT NOT NULL,
    "fechaNacimiento" TEXT,
    "fechaDeRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ci" TEXT NOT NULL,
    "rol" "UserRole" NOT NULL DEFAULT 'USUARIO',
    "tutorialCompletado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuarto" (
    "id" SERIAL NOT NULL,
    "direccion" TEXT NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "fotoUrlcuarto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "condiciones" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "propietarioId" INTEGER NOT NULL,
    "tipoCuarto" "TipoCuarto" NOT NULL,
    "estadoCuarto" "EstadoCuarto" NOT NULL,

    CONSTRAINT "cuarto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentario" (
    "id" SERIAL NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contenido" TEXT NOT NULL,
    "estrellas" INTEGER NOT NULL,
    "cuartoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubicacion" (
    "id" SERIAL NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "beneficios" TEXT NOT NULL,

    CONSTRAINT "ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensaje" (
    "id" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emisorId" INTEGER NOT NULL,
    "receptorId" INTEGER NOT NULL,
    "archivos" TEXT,

    CONSTRAINT "mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "cuartoId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "metodoPago" TEXT NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "fechaGenerada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deuda" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "deuda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificacion" (
    "id" SERIAL NOT NULL,
    "calificadorId" INTEGER NOT NULL,
    "calificadoId" INTEGER NOT NULL,
    "estrellas" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oferta" (
    "id" SERIAL NOT NULL,
    "cuartoId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UsuarioCuartos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_telefono_key" ON "usuario"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_ci_key" ON "usuario"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "_UsuarioCuartos_AB_unique" ON "_UsuarioCuartos"("A", "B");

-- CreateIndex
CREATE INDEX "_UsuarioCuartos_B_index" ON "_UsuarioCuartos"("B");

-- AddForeignKey
ALTER TABLE "cuarto" ADD CONSTRAINT "cuarto_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "ubicacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuarto" ADD CONSTRAINT "cuarto_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_cuartoId_fkey" FOREIGN KEY ("cuartoId") REFERENCES "cuarto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensaje" ADD CONSTRAINT "mensaje_emisorId_fkey" FOREIGN KEY ("emisorId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensaje" ADD CONSTRAINT "mensaje_receptorId_fkey" FOREIGN KEY ("receptorId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cuartoId_fkey" FOREIGN KEY ("cuartoId") REFERENCES "cuarto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deuda" ADD CONSTRAINT "deuda_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "calificacion_calificadoId_fkey" FOREIGN KEY ("calificadoId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "calificacion_calificadorId_fkey" FOREIGN KEY ("calificadorId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oferta" ADD CONSTRAINT "oferta_cuartoId_fkey" FOREIGN KEY ("cuartoId") REFERENCES "cuarto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioCuartos" ADD CONSTRAINT "_UsuarioCuartos_A_fkey" FOREIGN KEY ("A") REFERENCES "cuarto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioCuartos" ADD CONSTRAINT "_UsuarioCuartos_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
