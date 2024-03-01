import { useForm } from "@mantine/form";
import {
  TextInput,
  Box,
  Button,
  Modal,
  Space,
  ColorInput,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";

import { trpc } from "@/utils/trpc";
import queryClient from "@/utils/query-client";

interface FormValues {
  name: string;
  color: string;
}

export default function addModal() {
  //Add validation. Must be unique sent from DB add error message and
  const { mutate, isLoading, error } = trpc.createCategory.useMutation({
    onSettled: () => {
      form.reset;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ["getCategories"],
          { input: { limit: 10, page: 1 }, type: "query" },
        ],
      });
    },
  });

  const [openedModal, { open, close }] = useDisclosure(false);
  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      color: "",
    },
  });
  const router = useRouter();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    mutate(form.values);
  };

  return (
    <>
      <Modal
        opened={openedModal}
        onClose={close}
        title="Add New Category"
        centered
      >
        <form>
          <Box maw={320} mx="auto">
            <TextInput
              label="Name"
              placeholder="Name"
              {...form.getInputProps("name")}
            />
            <ColorInput
              label="Color"
              placeholder="Red"
              {...form.getInputProps("color")}
            />
            <TextInput
              label="Color"
              placeholder="Color"
              {...form.getInputProps("color")}
            />
            <Space h="md" />

            <Button onClick={submitData}>Add Category</Button>
          </Box>
        </form>
      </Modal>
      <Button onClick={open} ml="md">
        Add Category
      </Button>
    </>
  );
}
