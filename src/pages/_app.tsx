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
  const inputtedPassword = useRef("");

  const [isValid, setIsValid] = useState(false);

  async function validateUser() {
    const data = await apiGetPassword();
    const password = data?.data;

    console.log("inputtedPassword: ", inputtedPassword);
    console.log("password: ", password);
    if (inputtedPassword.current === password) {
      return;
    }

    const { value } = await Swal.fire({
      icon: "info",
      title: "Validasi diri anda",
      text: "Masukkan password",
      input: "password",
    });
    console.log("Value: ", value);
    inputtedPassword.current = value;
    console.log("Inputted Password: ", inputtedPassword);
    if (value !== password) {
      await Swal.fire({
        icon: "error",
        title: "Password Salah",
        text: "Password yang anda masukkan salah, silahkan refresh halaman dan input password lagi",
      });
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }

  useEffect(() => {
    async function start() {
      while (true) {
        await validateUser();

        await waitForSeconds(5);
      }
    }

    start();
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
