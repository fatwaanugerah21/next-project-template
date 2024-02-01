import { AppProps } from "next/app";
import { Group, MantineProvider, Title } from "@mantine/core";
import { mantineProviderTheme } from "@/themes/mantine.theme";
import { appWithTranslation } from "next-i18next";
import { Notifications } from "@mantine/notifications";
import { Poppins } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { title } from "process";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const queryClient = new QueryClient();

function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function validateUser() {
      const { value } = await Swal.fire({
        icon: "info",
        title: "Validasi diri anda",
        text: "Masukkan password",
        input: "password",
      });

      if (value === process.env.NEXT_PUBLIC_PASSWORD) {
        setIsValid(true);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Password Salah",
          text: "Password yang anda masukkan salah, silahkan refresh halaman dan input password lagi",
        });
      }
    }

    validateUser();
  }, []);

  if (!isValid) {
    return (
      <Group h={"100%"} align="center" position="center">
        <Title align="center">
          Silahkan Refresh Halaman ini dan masukkan password
        </Title>
      </Group>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={mantineProviderTheme}
      >
        <main className={poppins.className}>
          <Notifications />
          <Component {...pageProps} />
        </main>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
