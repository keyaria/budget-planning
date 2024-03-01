import {
  MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_Row,
  MRT_Table,
  MRT_TableOptions,
  MantineReactTable,
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
  Menu,
} from "@mantine/core";
import { ModalsProvider, modals } from "@mantine/modals";

import { IconEdit, IconShare, IconTrash, IconUser } from "@tabler/icons-react";
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

export default function ExpenseTable({ allExpenses }: any) {
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
  //UPDATE action
  //   const handleSaveUser: MRT_TableOptions<Expenses>["onEditingRowSave"] =
  //     async ({ values, table }) => {};

  // const handleSaveRow: MRT_TableOptions<Expenses>['onEditingRowSave'] = ({
  //    // exitEditingMode,
  //     row,
  //    // values
  //   }) => {
  //     console.log('entered', row.original)
  //   // tableData[row.index] = row.original;
  //     //setTableData([...tableData]);
  //   //  exitEditingMode();
  //   };

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
    enableEditing: true,
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
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),

    // renderRowActions: ({ row, table }) => (
    //   <Flex gap="md">
    //     <Tooltip label="Edit">
    //       <ActionIcon onClick={() => handleSaveRow}>
    //         <IconEdit />
    //       </ActionIcon>
    //     </Tooltip>
    //     <Tooltip label="Delete">
    //       {/* @ts-ignore */}
    //       <ActionIcon color="red" key={1} onClick={() => openDeleteConfirmModal(row)}>
    //         <IconTrash />
    //       </ActionIcon>
    //     </Tooltip>
    //   </Flex>
    // ),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <Card title="Expenses">
      {/* @ts-ignore */}
      <MantineReactTable
        table={table}
        data={allExpenses}
        editDisplayMode="table"
        enableEditing
      />
    </Card>
  );
}
