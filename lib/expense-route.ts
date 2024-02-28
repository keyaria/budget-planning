import { t } from "@/utils/trpc-server";
import {
  createCategorySchema,
  createExpenseSchema,
  deleteExpenseSchema,
  editExpenseSchema,
  filterQuery,
} from "./expense-schema";
import {
  addExpense,
  createCategory,
  deleteExpense,
  editExpense,
  getCategories,
  getData,
} from "./actions";

const expenseRouter = t.router({
  createCategory: t.procedure
    .input(createCategorySchema)
    .mutation(({ input }) => createCategory(input)),
  getCategory: t.procedure
    .input(filterQuery)
    .query(({ input }) => getCategories({ filterQuery: input })),

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
