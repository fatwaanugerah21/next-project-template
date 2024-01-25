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
import { useForm } from "@mantine/form";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import InputComponent from "../components/input.component";
import FormComponent from "@/components/form.component";

interface IHomepageProps {}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  };
};

type FormValues = {
  dptFile: File;
};

const Homepage: React.FC<IHomepageProps> = ({}) => {
  const { t } = useTranslation();

  const { getInputProps, onSubmit } = useForm<FormValues>({});

  function handleSubmit(values: FormValues) {
    console.log("values.dptFile: ", values.dptFile);
  }

  return (
    <>
      <SEO title={"Price Simulator"} />

      <MainLayout>
        <Text size={"xl"} weight={"bold"}>
          Input Nama Pemilih
        </Text>

        <Card withBorder mt={20}>
          <Group grow>
            <FormComponent onSubmit={onSubmit(handleSubmit)}>
              <Input {...getInputProps("dptFile")} type="file" />
              <Button type="submit">Chek Data</Button>
            </FormComponent>
          </Group>
        </Card>
      </MainLayout>
    </>
  );
};
export default Homepage;
