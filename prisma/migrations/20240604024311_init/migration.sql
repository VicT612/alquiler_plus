/*
  Warnings:

  - You are about to drop the `calificacion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `propietarioId` to the `comentario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "calificacion" DROP CONSTRAINT "calificacion_calificadoId_fkey";

-- DropForeignKey
ALTER TABLE "calificacion" DROP CONSTRAINT "calificacion_calificadorId_fkey";

-- AlterTable
ALTER TABLE "comentario" ADD COLUMN     "propietarioId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "calificacion";

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
