"use client";
import { useForm } from "@mantine/form";
import { ActionIcon, Flex, Pill, Tooltip } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MantineReactTable,
} from "mantine-react-table";
import { useCustomTable } from "@/utils/hooks/use-custom-table";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Category } from "@prisma/client";
import { useState, useMemo } from "react";
import { trpc } from "@/utils/trpc";
import queryClient from "@/utils/query-client";

interface FormValues {
  name: string;
  color: string;
}

export default function CategorySection({
  categories,
  pagination,
  setPagination,
}: any) {
  const form = useForm<FormValues>({ initialValues: { name: "", color: "" } });
  const router = useRouter();
  const [tableData, setTableData] = useState(categories);

  const { mutate: editMutate } = trpc.editCategory.useMutation({
    // onSettled: () => {
    //   form.reset;
    // },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ["getCategory"],
          { input: { take: 5, skip: 0 }, type: "query" },
        ],
      });
    },
  });

  // const [pagination, setPagination] = useState({
  //     pageIndex: 0,
  //     pageSize: 1
  // })
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  console.log("here", categories);

  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Type",
      },
      {
        accessorKey: "color",
        header: "Color",
      },
      {
        accessorKey: "id",
        header: "ID",
      },
    ],
    [],
  );

  const handleSaveRow: MRT_TableOptions<Category>["onEditingRowSave"] = async ({
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
    data: categories ?? [],
    rowCount: 2,
    enableTopToolbar: false,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableRowActions: true,
    onPaginationChange: setPagination,
    enableEditing: true,
    positionActionsColumn: "last",

    state: {
      pagination,
    },
    getRowId: (row) => row.id,

    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveRow,

    // renderRowActions: ({ row, table }) => (
    //   <Flex gap="md">
    //     <Tooltip label="Edit">
    //       <ActionIcon onClick={() => table.setEditingRow(row)}>
    //         <IconEdit />
    //       </ActionIcon>
    //     </Tooltip>
    //     <Tooltip label="Delete">
    //       <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
    //         <IconTrash />
    //       </ActionIcon>
    //     </Tooltip>
    //   </Flex>
    // ),

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
      pagination,
    },
  });

  return (
    <>
      <MantineReactTable table={table} data={categories} />
    </>
  );
}
