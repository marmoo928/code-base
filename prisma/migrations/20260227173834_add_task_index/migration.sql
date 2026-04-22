/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `index` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_index_key" ON "Task"("index");
