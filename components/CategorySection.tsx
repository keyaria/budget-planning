"use client";

import { ActionIcon, Flex, Group } from "@mantine/core";
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MantineReactTable,
} from "mantine-react-table";
import { useCustomTable } from "@/utils/hooks/use-custom-table";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Category } from "@prisma/client";
import { useState, useMemo } from "react";
import { trpc } from "@/utils/trpc";
import queryClient from "@/utils/query-client";

export default function CategorySection({
  categories,
  pagination,
  setPagination,
}: any) {
  const [tableData, setTableData] = useState(categories);

  const { mutate: editMutate } = trpc.editCategory.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ["getCategory"],
          { input: { take: 3, skip: 0 }, type: "query" },
        ],
      });
    },
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

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
    editMutate(values);
    tableData[row.index] = values;

    setTableData([...tableData]);
    table.setEditingRow(null); //exit editing mode
  };

  const table = useCustomTable({
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
  });

  const nextPage = async () => {
    const lastPostInResults: any = categories[0];
    const myCursor = lastPostInResults.id;
    setPagination({ pageIndex: 1, pageSize: 1 });
  };

  const prevPage = async () => {
    const lastPostInResults: any = categories[0];
    const myCursor = lastPostInResults.id;

    setPagination({ pageIndex: 0, pageSize: 1 });
  };

  return (
    <Flex direction="column" w="100%">
      <MantineReactTable table={table} data={categories} />

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
    </Flex>
  );
}
