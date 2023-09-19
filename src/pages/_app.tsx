import { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { mantineProviderTheme } from "@/themes/mantine.theme";
import { appWithTranslation } from "next-i18next";
import { Notifications } from "@mantine/notifications";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
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
  );
}

export default appWithTranslation(App);
