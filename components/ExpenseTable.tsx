import {
  MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_Row,
  MRT_Table,
  MRT_TableOptions,
} from "mantine-react-table";
import { useCustomTable } from "@/utils/hooks/use-custom-table";
import {
  ActionIcon,
  Card,
  Flex,
  Stack,
  Title,
  Tooltip,
  Text,
  Button,
} from "@mantine/core";
import { ModalsProvider, modals } from "@mantine/modals";

import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Expenses } from "@prisma/client";
//import { deleteExpense } from "@/lib/actions";
import { useState } from "react";
import queryClient from "@/utils/query-client";
import { trpc } from "@/utils/trpc";

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

export default function ExpenseTable({ allExpenses }: any) {
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
  const columns: MRT_ColumnDef<Expense>[] = [
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
  ];
  console.log("all", allExpenses);
  //UPDATE action
  const handleSaveUser: MRT_TableOptions<Expenses>["onEditingRowSave"] =
    async ({ values, table }) => {};
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

  const handleCreateUser = () => {};
  const table = useCustomTable({
    // @ts-ignore
    columns,
    data: allExpenses ?? [],
    rowCount: allExpenses?.length ?? 0,
    enableTopToolbar: false,
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal",
    enableRowActions: true,
    enableEditing: true,
    getRowId: (row) => row.id,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,

    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit User</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
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
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <Card radius="md">
      <Card.Section>
        <Title order={5}>Transactions</Title>
      </Card.Section>
      <Card.Section>
        <MRT_Table table={table} />
      </Card.Section>
    </Card>
  );
}
