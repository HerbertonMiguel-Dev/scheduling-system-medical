/*
  Warnings:

  - Made the column `nome` on table `Especialidade` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome` on table `Medico` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Especialidade" ALTER COLUMN "nome" SET NOT NULL;

-- AlterTable
ALTER TABLE "Medico" ALTER COLUMN "nome" SET NOT NULL;
