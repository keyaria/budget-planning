/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_categoryId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_name_fkey" FOREIGN KEY ("name") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
