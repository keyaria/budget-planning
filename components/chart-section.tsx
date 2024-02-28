import { Card, Select } from "@mantine/core";
import { useState } from "react";
import { BarChart } from "recharts";
import { date } from "zod";

export default function chartSection(
  date: any,
  allCategories: Categories[],
  handleSelect: any,
) {
  const [value, setValue] = useState<string | null>("");

  return (
    <>
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
    </>
  );
}
