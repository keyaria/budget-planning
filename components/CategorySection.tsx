"use client";
import { useForm } from "@mantine/form";
import { Pill } from "@mantine/core";
import { useRouter } from "next/navigation";

interface FormValues {
  name: string;
  color: string;
}

export default function CategorySection(categories: any) {
  const form = useForm<FormValues>({ initialValues: { name: "", color: "" } });
  const router = useRouter();

  return (
    <>
      {categories.categories.map((category: any) => {
        return <Pill>{category.name}</Pill>;
      })}
    </>
  );
}
