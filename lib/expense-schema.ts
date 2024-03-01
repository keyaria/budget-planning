import { TypeOf, any, number, object, string, z } from "zod";

export const createExpenseSchema = object({
  name: string({ required_error: "Name is required" }),
  amount: number().default(0),
  date: z.date(),
  notes: z.optional(z.string()),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  // DA: string({ required_error: 'Email is required' }).email('Invalid email'),
});

export const editExpenseSchema = object({
  id: string(),
  name: string(),
  notes: string(),
  amount: number(),
});

export const deleteExpenseSchema = object({
  id: string(),
});

export const createCategorySchema = object({
  name: string({ required_error: "Name is required" }),
  color: string({ required_error: "Color is required" }),
  // DA: string({ required_error: 'Email is required' }).email('Invalid email'),
});

export const editCategorySchema = object({
  id: string(),
  name: string(),
  color: string(),
});

export const filterQuery = object({
  skip: number().default(1),
  take: number().default(5),
  myCursor: z.optional(z.string()),
});

export const filterQueryCategory = object({
  pageIndex: z.optional(number().default(1)),
  pageSize: z.optional(number().default(5)),
});

export type createCategoryInput = TypeOf<typeof createCategorySchema>;
export type editCategoryInput = TypeOf<typeof editCategorySchema>;
export type CreateExpenseInput = TypeOf<typeof createExpenseSchema>;
export type DeleteExpenseInput = TypeOf<typeof deleteExpenseSchema>;
export type EditExpenseInput = TypeOf<typeof editExpenseSchema>;
export type FilterQueryInput = TypeOf<typeof filterQuery>;
export type FilterQueryCategoryInput = TypeOf<typeof filterQueryCategory>;
