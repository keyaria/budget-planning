-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_name_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
