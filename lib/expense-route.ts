import { t } from "@/utils/trpc-server";
import {
  createCategorySchema,
  createExpenseSchema,
  deleteExpenseSchema,
  editCategorySchema,
  editExpenseSchema,
  filterQuery,
  filterQueryCategory,
} from "./expense-schema";
import {
  addExpense,
  createCategory,
  deleteExpense,
  editCategory,
  editExpense,
  getCategories,
  getData,
} from "./actions";

const expenseRouter = t.router({
  createCategory: t.procedure
    .input(createCategorySchema)
    .mutation(({ input }) => createCategory(input)),
  getCategory: t.procedure
    .input(filterQueryCategory)
    .query(({ input }) => getCategories({ filterQuery: input })),
  editCategory: t.procedure
    .input(editCategorySchema)
    .mutation(({ input }) => editCategory(input)),

  getExpenses: t.procedure
    .input(filterQuery)
    .query(({ input }) => getData({ filterQuery: input })),

  addExpense: t.procedure
    .input(createExpenseSchema)
    .mutation(({ input }) => addExpense(input)),

  editExpense: t.procedure
    .input(editExpenseSchema)
    .mutation(({ input }) => editExpense(input)),

  deleteExpense: t.procedure
    .input(deleteExpenseSchema)
    .mutation(({ input }) => deleteExpense(input)),
});

export default expenseRouter;
