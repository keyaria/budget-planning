import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "mantine-react-table/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  createTheme,
  MantineProvider,
  ColorSchemeScript,
  MantineColorsTuple,
} from "@mantine/core";
import { TrpcProvider } from "@/utils/trpc-provider";
import { ModalsProvider } from "@mantine/modals";
//import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Tracking App",
  description: "Budget Tracking Appplication",
};
const myColor: MantineColorsTuple = [
  "#ebfeff",
  "#d8fafc",
  "#acf7fa",
  "#80f3f8",
  "#63f0f6",
  "#56eef6",
  "#4deef5",
  "#40d3db",
  "#30bcc3",
  "#04a3aa",
];
const theme = createTheme({
  colors: {
    myColor,
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <TrpcProvider>
          <MantineProvider theme={theme}>
            <ModalsProvider>{children}</ModalsProvider>
          </MantineProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
