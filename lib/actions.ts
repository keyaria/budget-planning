"use server";

import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import {
  CreateExpenseInput,
  DeleteExpenseInput,
  EditExpenseInput,
  FilterQueryInput,
  createCategoryInput,
} from "./expense-schema";

// CATEGORY API
export async function getCategories({
  filterQuery,
}: {
  filterQuery: FilterQueryInput;
}) {
  try {
    const result = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        color: true,
      },
      skip: filterQuery.skip,
      take: filterQuery.take,
    });

    return {
      success: true,
      results: result.length,
      data: { result },
    };
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
}

export async function createCategory(data: createCategoryInput) {
  const name = data.name as string;
  const color = data.color as string;

  try {
    const category = await prisma.category.create({
      data: {
        name,
        color,
      },
    });
    return { success: true, data: { category } };
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
}

// EXPENSE API
export async function getData({
  filterQuery,
}: {
  filterQuery: FilterQueryInput;
}) {
  if (filterQuery.myCursor) {
    try {
      const expenses = await prisma.expenses.findMany({
        select: {
          id: true,
          name: true,
          notes: true,
          date: true,
          category: {
            select: {
              name: true,
            },
          },
          amount: true,
          categoryId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: filterQuery.skip,
        take: filterQuery.take,
        cursor: {
          id: filterQuery.myCursor, // The cursor - only on pages 2 and above
        },
      });
      return {
        status: "success",
        results: expenses.length,
        data: {
          expenses,
        },
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  } else {
    try {
      const expenses = await prisma.expenses.findMany({
        select: {
          id: true,
          name: true,
          notes: true,
          date: true,
          category: {
            select: {
              name: true,
            },
          },
          amount: true,
          categoryId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: filterQuery.skip,
        take: filterQuery.take,
      });
      return {
        status: "success",
        results: expenses.length,
        data: {
          expenses,
        },
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  }
}

export async function addExpense(data: CreateExpenseInput) {
  try {
    const result = await prisma.expenses.create({
      data: {
        category: {
          connect: { id: data.category.id },
        },
        name: data.name,
        amount: data.amount,
        date: data.date,
        notes: data.notes,
      },
    });
    return { success: true, data: { result } };
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
}

export async function editExpense(data: EditExpenseInput) {
  try {
    const result = await prisma.expenses.update({
      where: { id: data.id },
      data: {
        name: data.id,
        amount: data.amount,
        notes: data.notes,
      },
    });

    return { success: true, data: { result } };
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
}

export async function deleteExpense(data: DeleteExpenseInput) {
  try {
    const result = await prisma.expenses.delete({
      where: {
        id: data.id,
      },
    });

    return { success: true, data: { result } };
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
}

// export async function groupExpense() {
//   const data = await prisma.expenses.groupBy({
//     by: ["categoryId"],
//     _sum: {
//       amount: true,
//     },

//   });

//   return data;
// }
