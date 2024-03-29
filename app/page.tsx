"use client";

import {
  AppShell,
  Flex,
  Grid,
  GridCol,
  Text,
  Button,
  Select,
  Space,
  LoadingOverlay,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CategorySection from "@/components/CategorySection";

import { useEffect, useState } from "react";
import { BarChart } from "@mantine/charts";
import AddModal from "@/components/AddModal";
import ExpenseTable from "@/components/ExpenseTable";
import Card from "@/components/common/Card";
import AddCategoryModal from "@/components/AddCategoryModal";
import { trpc } from "@/utils/trpc";

import Navbar from "@/components/Navbar";
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  const [salesByMonth, setSalesByMonth]: any = useState(0);
  const [date, setdate] = useState();
  const [pagination, setPagintion] = useState({
    skip: 0,
    take: 5,
    myCursor: undefined,
  });
  const [categoryPagination, setCategoryPagination] = useState({
    pageIndex: 0,
    pageSize: 3,
  });

  const {
    data: allExpenses,
    isLoading: loadingExpenses,
    isError,
    refetch,
    error: expensesError,
  } = trpc.getExpenses.useQuery(pagination);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const { data: allCategories } = trpc.getCategory.useQuery(categoryPagination);
  const [value, setValue] = useState<string | null>("");

  const error = console.error;

  //WorkAround: Error appears for X and Yaxis default props, charts package issue: https://github.com/recharts/recharts/issues/3615
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  useEffect(() => {
    if (allExpenses) {
      const sbM = allExpenses.data.expenses.reduce(
        (result: any, { amount }: any) => {
          result = (result || 0) + amount;

          return result;
        },
        0,
      );

      setSalesByMonth(sbM);
      configureChartData("month");
    }
  }, [allExpenses]);

  const configureChartData = (time: string) => {
    const chartData = allExpenses?.data.expenses.reduce(
      (result: any, { category, amount, date }: any) => {
        let dateTime: string;
        if (time === "month") {
          dateTime = date.toLocaleString("default", { month: "long" });
        } else if (time === "day") {
          dateTime = date.toLocaleString("default", { weekday: "short" });
        } else {
          dateTime = date.toLocaleString("default", { year: "numeric" });
        }
        const found = result.find((a: any) => a.month === dateTime);

        if (!found) {
          result.push({ month: dateTime, [category.name]: amount }); // not found, so need to add data property
        } else {
          found[category.name] = (found[category.name] || 0) + amount; // if found, that means data property exists, so just push new element to found.data.
        }
        return result;
      },
      [],
    );

    setdate(chartData);
    return;
  };

  //if (isLoading || isFetching) return <p>Loading...</p>;
  const handleSelect = (value: any) => {
    setValue(value);
    configureChartData(value);
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
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

      <AppShell.Header bg={"rgb(248, 249, 250)"}>
        <Flex justify="right" align="center" px="1em" h="100%">
          <Avatar radius="xl" />

          <Button onClick={handleSignOut} variant="transparent">
            Sign Out
          </Button>
        </Flex>
      </AppShell.Header>

      <Navbar />

      <AppShell.Main>
        <Grid>
          <GridCol>
            <AddModal categories={allCategories?.data.result} />

            <AddCategoryModal />
          </GridCol>
          <GridCol span={{ sm: 12, md: 12, lg: 4 }}>
            <Card title={"Total Expenses"}>
              <Text size="xl"> ${salesByMonth}</Text>
            </Card>
            <Space h="md" />

            <Card title={"Categories"}>
              {allCategories && allCategories.data.result.length !== 0 && (
                <CategorySection
                  categories={allCategories.data.result}
                  pagination={categoryPagination}
                  setPagination={setCategoryPagination}
                />
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
            <ExpenseTable
              allExpenses={allExpenses?.data.expenses}
              pagination={pagination}
              setPagintion={setPagintion}
            />
            <Space h="md" />
          </GridCol>
        </Grid>
      </AppShell.Main>
    </AppShell>
  );
}
