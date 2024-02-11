import { AppProps } from "next/app";
import { Group, MantineProvider, Title } from "@mantine/core";
import { mantineProviderTheme } from "@/themes/mantine.theme";
import { appWithTranslation } from "next-i18next";
import { Notifications } from "@mantine/notifications";
import { Poppins } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { title } from "process";
import { apiGetPassword } from "@/apis/auth.api";
import { waitForSeconds } from "@/utils/function.util";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const queryClient = new QueryClient();

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineProviderTheme}>
        <main className={poppins.className}>
          <Notifications />
          <Component {...pageProps} />
        </main>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
