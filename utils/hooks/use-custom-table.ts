import { Flex, Stack, Title } from "@mantine/core";
import {
  MRT_TableOptions,
  MRT_EditActionButtons,
  useMantineReactTable,
} from "mantine-react-table";

export type CustomTableOptions<TData extends Record<string, any> = {}> = Omit<
  MRT_TableOptions<TData>,
  | "manualPagination"
  | "enablePagination"
  | "mantinePaginationProps"
  | "paginationDisplayMode"
  | "mantineTableProps.align"
  | "mantinePaperProps"
  | "initialState.density"
>;

export const useCustomTable = <TData extends Record<string, any> = {}>(
  tableOptions: CustomTableOptions<TData>,
) => {
  return useMantineReactTable({
    ...{
      paginationDisplayMode: "custom",
      // // filters
      // manualFiltering: true,
      // // styles
      // mantineTableProps: {
      //   align: "center",
      // },
      mantinePaperProps: {
        shadow: "0",
        radius: "md",
        p: "md",
        withBorder: false,
      },
      displayColumnDefOptions: {
        "mrt-row-actions": {
          size: 100, //make actions column wider
        },
      },
      manualPagination: true,
      mantineFilterTextInputProps: {
        style: { borderBottom: "unset", marginTop: "8px" },
        variant: "filled",
      },
      mantineFilterSelectProps: {
        style: { borderBottom: "unset", marginTop: "8px" },
        variant: "filled",
      },

      // features
      enableColumnActions: false,
      // enableDensityToggle: false,
      // enableFullScreenToggle: false,
      // enableHiding: false,
      // enablePinning: false,

      // states
      // initialState: {
      //   density: "md",
      // },
      columns: [],
      data: [],
    },
    ...tableOptions,
  });
};

// renderRowActions: ({ row, table }) => (
//     <Flex gap="md">
//       <Tooltip label="Edit">
//         <ActionIcon onClick={() => table.setEditingRow(row)}>
//           <IconEdit />
//         </ActionIcon>
//       </Tooltip>
//       <Tooltip label="Delete">
//         <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
//           <IconTrash />
//         </ActionIcon>
//       </Tooltip>
//     </Flex>
//   ),
