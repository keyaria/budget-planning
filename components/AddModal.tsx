import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Modal,
  Select,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { Category } from "@prisma/client/wasm";
import { useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { trpc } from "@/utils/trpc";
import queryClient from "@/utils/query-client";

interface FormValues {
  name: string;
  amount: number;
  date: number | null;
  notes: string;
  category: Category | null;
}

export default function addModal({ categories }: any) {
  const { mutate } = trpc.addExpense.useMutation({
    onSettled: () => {
      form.reset;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ["getExpense"],
          { input: { take: 5, skip: 0 }, type: "query" },
        ],
      });
    },
  });

  const [openedModal, { open, close }] = useDisclosure(false);
  const [select, setSelect] = useState([]);

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      amount: 0,
      date: null,
      notes: "",
      category: null,
    },
  });
  const router = useRouter();

  const openModal = async () => {
    let items = categories.map((i: any) => {
      return i.name;
    });
    setSelect(items);
    return open();
  };

  const handleAddExpense = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    let cat = categories.find((i: any) => {
      return i["name"] === form.values.category;
    });
    console.log("cate", categories, form.values.category);
    // @ts-ignore
    form.values.category = cat;

    //@ts-ignore
    mutate(form.values);

    close();
  };

  return (
    <>
      <Modal opened={openedModal} onClose={close} title="Add To Spend" centered>
        <form>
          <TextInput
            name="title"
            label="Item Name"
            placeholder="Pizza"
            required
            {...form.getInputProps("name")}
          />
          <NumberInput
            name="amount"
            label="Amount"
            withAsterisk
            placeholder="Input placeholder"
            required
            {...form.getInputProps("amount")}
          />
          <DateTimePicker
            valueFormat="DD MMM YYYY hh:mm A"
            label="Pick date and time"
            placeholder="Pick date and time"
            {...form.getInputProps("date")}
          />
          <Select
            name="category"
            label="Category"
            placeholder="Pick one"
            {...form.getInputProps("category")}
            data={select}
            required
          />
          <Textarea
            name="notes"
            label="Note"
            placeholder="Input placeholder"
            {...form.getInputProps("notes")}
          />
          <Button
            fullWidth
            mt="xl"
            type="submit"
            onClick={handleAddExpense}
            disabled={form.values.name === ""}
          >
            Add to Expense
          </Button>
        </form>
      </Modal>
      <Button onClick={openModal}>Add Expense</Button>
    </>
  );
}
