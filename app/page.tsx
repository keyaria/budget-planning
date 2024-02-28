"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {
  AppShell,
  Burger,
  Flex,
  Grid,
  GridCol,
  Title,
  Text,
  Button,
  Modal,
  PasswordInput,
  Select,
  TextInput,
  Space,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CategorySection from "@/components/CategorySection";

import { useEffect, useState } from "react";
import classes from "@/components/Dashboard.module.css";
import { BarChart } from "@mantine/charts";
import { Form } from "@mantine/form";
import AddModal from "@/components/AddModal";
import ExpenseTable from "@/components/ExpenseTable";
import Card from "@/components/common/Card";
import { Category, Expenses } from "@prisma/client";
import AddCategoryModal from "@/components/AddCategoryModal";
import { trpc } from "@/utils/trpc";

export default function Home() {
  //let { data, isLoading, isFetching } = trpc.healthchecker.useQuery();

  const [opened, { toggle }] = useDisclosure();
  const [salesByMonth, setSalesByMonth]: any = useState(0);
  const [date, setdate] = useState();
  const { data: allExpenses, isLoading: loadingExpenses } =
    trpc.getExpenses.useQuery({ skip: 0, take: 5 });
  const { data: allCategories } = trpc.getCategory.useQuery({
    skip: 0,
    take: 5,
  });
  const [value, setValue] = useState<string | null>("");

  const error = console.error;

  //WorkAround: Error appears for X and Yaxis default props, charts package issue: https://github.com/recharts/recharts/issues/3615
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  console.log("expenses", allExpenses);

  useEffect(() => {
    if (allExpenses) {
      const sbM = allExpenses.data.expenses.reduce(
        (result: any, { date, amount, category }: any) => {
          result = (result || 0) + amount;

          return result;
        },
        0,
      );

      console.log("sbm", sbM);

      // console.log("sadsd", sbMt);

      setSalesByMonth(sbM);
      configureChartData("month");
    }
  }, [allExpenses]);

  const cardStyle = {
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px",
  };

  const configureChartData = (time: string) => {
    const chartData = allExpenses?.data.expenses.reduce(
      (result: any, { category, amount, date }: any) => {
        console.log("result", result);
        // @ts-ignore
        let month: any;
        if (time === "month") {
          month = date.toLocaleString("default", { month: "long" });
        } else if (time === "day") {
          month = date.toLocaleString("default", { weekday: "short" });
        } else {
          month = date.toLocaleString("default", { year: "numeric" });
        }
        const found = result.find((a: any) => a.month === month);
        //const value = { name: d.name, val: d.value };
        const value = { [category.name]: amount }; // the element in data property
        if (!found) {
          //acc.push(...value);
          result.push({ month: month, [category.name]: amount }); // not found, so need to add data property
        } else {
          //acc.push({ name: d.name, data: [{ value: d.value }, { count: d.count }] });
          console.log("dsas", result[found], found);
          found[category.name] = (found[category.name] || 0) + amount; // if found, that means data property exists, so just push new element to found.data.
        }
        return result;
      },
      [],
    );

    setdate(chartData);
    return;
  };
  const nextPage = async () => {
    if (allExpenses) {
      const lastPostInResults: any = allExpenses.data.expenses[0];
      const myCursor = lastPostInResults.id;
      //setAllExpenses(data);
    }
  };

  //if (isLoading || isFetching) return <p>Loading...</p>;
  const handleSelect = (value: any) => {
    setValue(value);
    configureChartData(value);
  };
  //const session = await auth();
  return (
    // <Hydrate state={dehydrate(helpers.queryClient)}>
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 100,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      bg={"rgb(248, 249, 250)"}
    >
      <LoadingOverlay
        visible={loadingExpenses}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <AppShell.Header>
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar p="md" bg={"rgb(248, 249, 250)"}>
        Navbar
      </AppShell.Navbar>

      <AppShell.Main>
        <Grid>
          <GridCol>
            {/* @ts-ignore */}
            <AddModal categories={allCategories?.data.result} />

            <AddCategoryModal />
          </GridCol>
          <GridCol span={{ sm: 12, md: 12, lg: 4 }}>
            <Card title={"Total Spent"}>
              <Text>{salesByMonth && salesByMonth}</Text>
            </Card>
            <Space h="md" />

            <Card title={"Categories"}>
              {allCategories && allCategories.data.result.length !== 0 && (
                <CategorySection categories={allCategories.data.result} />
              )}
            </Card>
          </GridCol>
          <GridCol span={{ sm: 12, md: 12, lg: 8 }}>
            <Flex direction="column" h="100%" justify="space-between" gap="md">
              <Card title={"Total Spent"}>
                <Select
                  data={["year", "day", "month"]}
                  placeholder="Month"
                  value={value}
                  onChange={handleSelect}
                ></Select>
                {date && allCategories && (
                  <BarChart
                    h={300}
                    data={date && date}
                    dataKey="month"
                    type="stacked"
                    series={allCategories.data.result}
                  />
                )}
              </Card>
            </Flex>
          </GridCol>

          <GridCol span={12}>
            <ExpenseTable allExpenses={allExpenses?.data.expenses} />
            <Button onClick={nextPage}>Prev Page</Button>
            <Button onClick={nextPage}>Next Page</Button>
            {/* <TransactionCard /> */}
          </GridCol>
        </Grid>
      </AppShell.Main>
    </AppShell>
    // </Hydrate>
  );
}
