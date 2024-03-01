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
  // const handleSaveUser: MRT_TableOptions<User>['onEditingRowSave'] = async ({
  //     values,
  //     table,
  //   }) => {
  //     const newValidationErrors = validateUser(values);
  //     if (Object.values(newValidationErrors).some((error) => error)) {
  //       setValidationErrors(newValidationErrors);
  //       return;
  //     }
  //     setValidationErrors({});
  //     await updateUser(values);
  //     table.setEditingRow(null); //exit editing mode
  //   };

  //   //DELETE action
  //   const openDeleteConfirmModal = (row: MRT_Row<User>) =>
  //     modals.openConfirmModal({
  //       title: 'Are you sure you want to delete this user?',
  //       children: (
  //         <Text>
  //           Are you sure you want to delete {row.original.firstName}{' '}
  //           {row.original.lastName}? This action cannot be undone.
  //         </Text>
  //       ),
  //       labels: { confirm: 'Delete', cancel: 'Cancel' },
  //       confirmProps: { color: 'red' },
  //       onConfirm: () => deleteUser(row.original.id),
  //     });
  return useMantineReactTable({
    ...{
      // paginationDisplayMode: "pages",
      // // filters
      // manualFiltering: true,
      // // styles
      // mantineTableProps: {
      //   align: "center",
      // },
      // positionActionsColumn: "last",
      mantinePaperProps: {
        shadow: "0",
        radius: "md",
        p: "md",
        withBorder: false,
      },
      displayColumnDefOptions: {
        "mrt-row-actions": {
          size: 500, //make actions column wider
        },
      },
      mantineFilterTextInputProps: {
        style: { borderBottom: "unset", marginTop: "8px" },
        variant: "filled",
      },
      mantineFilterSelectProps: {
        style: { borderBottom: "unset", marginTop: "8px" },
        variant: "filled",
      },

      // features
      // enableColumnActions: false,
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
