import { Card as MantineCard, Title } from "@mantine/core";
import classes from "@/components/Dashboard.module.css";

export default function Card({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title: string;
}>) {
  const cardStyle = {
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px",
  };

  return (
    <MantineCard radius="md" style={cardStyle}>
      <MantineCard.Section className={classes.section}>
        <Title order={5}>{title}</Title>
      </MantineCard.Section>
      <MantineCard.Section className={classes.section}>
        {children}
      </MantineCard.Section>
    </MantineCard>
  );
}
