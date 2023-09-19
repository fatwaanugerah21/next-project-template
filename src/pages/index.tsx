import React from "react";
import SEO from "../components/seo.component";
import MainLayout from "../layouts/main.layout";
import {
  Button,
  Card,
  Flex,
  Group,
  Input,
  Text,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import InputComponent from "../components/input.component";

interface IHomepageProps {}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  };
};

const Homepage: React.FC<IHomepageProps> = ({}) => {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={"Price Simulator"} />

      <MainLayout>
        <Text size={"xl"} weight={"bold"}>
          {t("example-text-to-be-translated")}
        </Text>

        <Card withBorder mt={20}>
          <Group grow>
            Use Here
            <Button>JKSC</Button>
          </Group>
        </Card>
      </MainLayout>
    </>
  );
};
export default Homepage;
