/*
  Warnings:

  - Added the required column `Departamento` to the `ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barrio` to the `ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calle` to the `ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ciudad` to the `ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais` to the `ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provincia` to the `ubicacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ubicacion" ADD COLUMN     "Departamento" TEXT NOT NULL,
ADD COLUMN     "barrio" TEXT NOT NULL,
ADD COLUMN     "calle" TEXT NOT NULL,
ADD COLUMN     "ciudad" TEXT NOT NULL,
ADD COLUMN     "pais" TEXT NOT NULL,
ADD COLUMN     "provincia" TEXT NOT NULL,
ALTER COLUMN "beneficios" DROP NOT NULL;

-- AlterTable
ALTER TABLE "usuario" ALTER COLUMN "ci" DROP NOT NULL;
