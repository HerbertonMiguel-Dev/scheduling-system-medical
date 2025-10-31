/*
  Warnings:

  - Made the column `nome` on table `Convenio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Convenio" ALTER COLUMN "nome" SET NOT NULL;
