import {
  MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_Row,
  MRT_Table,
  MRT_TableOptions,
  MantineReactTable,
} from "mantine-react-table";

import { useCustomTable } from "@/utils/hooks/use-custom-table";
import { ActionIcon, Card, Flex, Tooltip, Text, Group } from "@mantine/core";
import { ModalsProvider, modals } from "@mantine/modals";

import {
  IconEdit,
  IconShare,
  IconTrash,
  IconUser,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Expenses } from "@prisma/client";
//import { deleteExpense } from "@/lib/actions";
import { useMemo, useState } from "react";
import queryClient from "@/utils/query-client";
import { trpc } from "@/utils/trpc";
import { editExpense } from "@/lib/actions";

type Expense = {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: Category;
  notes: string;
};
type Category = {
  authorId: string | null;
  color: string;
  created_at: string;
  id: string;
  name: string;
  updated_at: string;
};

export default function ExpenseTable({
  allExpenses,
  setPagintion,
  pagination,
}: any) {
  const { mutate: editMutate } = trpc.editExpense.useMutation({
    // onSettled: () => {
    //   form.reset;
    // },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ["getExpense"],
          { input: { take: 5, skip: 0 }, type: "query" },
        ],
      });
    },
  });

  const [tableData, setTableData] = useState(allExpenses);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { mutate } = trpc.deleteExpense.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ["getExpense"],
          { input: { take: 5, skip: 0 }, type: "query" },
        ],
      });
    },
  });
  const columns = useMemo<MRT_ColumnDef<Expense>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Title",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "date",
        accessorFn: (row) => row.date.toLocaleString(),
        header: "Date",
      },
      {
        accessorKey: "notes",
        header: "Notes",
      },
      {
        accessorKey: "category",
        accessorFn: (row) => row.category.name,
        header: "Category",
      },
    ],
    [],
  );

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Expenses>) =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this user?",
      children: (
        <Text>
          Are you sure you want to delete {row.original.name}? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => mutate({ id: row.original.id }),
    });

  const handleSaveRow: MRT_TableOptions<Expense>["onEditingRowSave"] = async ({
    table,
    row,
    values,
  }) => {
    console.log("values", values, row);
    editMutate(values);
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    tableData[row.index] = values;
    //send/receive api updates here
    setTableData([...tableData]);
    table.setEditingRow(null); //exit editing mode
  };
  const table = useCustomTable({
    // @ts-ignore
    columns,
    data: allExpenses ?? [],
    rowCount: allExpenses?.length ?? 0,
    enableTopToolbar: false,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableRowActions: true,
    onPaginationChange: setPagintion,
    enableEditing: true,

    state: {
      pagination,
    },
    getRowId: (row) => row.id,

    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveRow,

    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          {/* @ts-ignore */}
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    initialState: {
      pagination: pagination,
    },
  });

  const nextPage = async () => {
    if (allExpenses) {
      const lastPostInResults: any = allExpenses[0];
      const myCursor = lastPostInResults.id;
      setPagintion({ skip: 1, take: 1, myCursor: myCursor });
    }
  };

  const prevPage = async () => {
    if (allExpenses) {
      const lastPostInResults: any = allExpenses[0];
      const myCursor = lastPostInResults.id;

      setPagintion({ skip: 0, take: 1, myCursor: myCursor });
    }
  };

  return (
    <Card title="Expenses">
      {/* @ts-ignore */}
      <MantineReactTable table={table} data={allExpenses} enableEditing />

      <Group justify="right">
        <ActionIcon variant="filled" aria-label="Prev Page" onClick={prevPage}>
          <IconArrowLeft style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
        <ActionIcon variant="filled" aria-label="Next Page" onClick={nextPage}>
          <IconArrowRight
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Group>
    </Card>
  );
}
