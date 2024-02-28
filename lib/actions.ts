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
import { Prisma } from "@prisma/client";
// import {
//     ConflictException,
//     HttpException,
//     Injectable,
//     NotFoundException,
//     UnauthorizedException,
//   } from '@nestjs/common';

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
        // Expenses: true,
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
  //   const name  = data.get("name") as string;
  //   const color = data.get("color") as string;
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

//DONT NEED THIS CHECK
export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw error;
      //  throw new NotFoundException(`User with id ${id} not found`);
    }
    throw error;
    // throw error if any
    //throw new HttpException(error, 500);
  }
}

// export async function getData(params: {
//     take?: number;
//     cursor?: any
// }) {
//     const { take, cursor } = params;

//     const data = await prisma.expenses.findMany({
//       select: {
//         title: true,
//         notes: true,
//         date: true,
//         category: {
//             select: {
//                 name: true
//             }
//         },
//         amount: true,
//         categoryId: true
//       },
//       orderBy: {
//         createdAt: 'desc'
//       },
//       take,
//       skip: 1,
//       cursor

//     })

//   return data;
//   }

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
      console.log("err", error);
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
      console.log("err", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  }
}

// export async function getPagExpenseDatac(myCursor: any) {
//   const data = await prisma.expenses.findMany({
//     select: {
//       id: true,
//       name: true,
//       notes: true,
//       date: true,
//       category: {
//         select: {
//           name: true,
//         },
//       },
//       amount: true,
//       categoryId: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     skip: 1,
//     take: 2,
//     cursor: {
//       id: myCursor, // The cursor - only on pages 2 and above
//     },
//   });
//   // const lastPostInResults: any = data[0]
//   // const myCursor = lastPostInResults.id

//   return data;
// }

export async function addExpense(data: CreateExpenseInput) {
  console.log("entereed", data);
  try {
    const result = await prisma.expenses.create({
      data: {
        category: {
          connect: { id: data.category.id },
        },
        name: data.category.name,
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
// //  .catch((error: any) => {
// //   console.log('e', error)
// // //   if (error instanceof Prisma.PrismaClientKnownRequestError) {
// // //     console.log('error', error)
// // //     if (error.code === 'P2002') {
// // //       console.log(
// // //         'There is a unique constraint violation'
// // //       )
// // //   }

// // // }
// //   })
//   return { success: true, result};
// }

export async function groupExpense() {
  const data = await prisma.expenses.groupBy({
    by: ["categoryId"],
    _sum: {
      amount: true,
    },
    // include: {
    //     date: true
    // }
  });
  // const data = await prisma.expenses.aggregate({
  //     where: {
  //         category: category.name
  //     }
  //   })

  return data;
}
