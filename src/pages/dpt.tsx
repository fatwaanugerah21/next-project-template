import React, { useState } from "react";
import * as XLSX from "xlsx";
import SEO from "../components/seo.component";
import MainLayout from "../layouts/main.layout";
import * as yup from "yup";
import {
  Button,
  Card,
  FileInput,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm, yupResolver, zodResolver } from "@mantine/form";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import InputComponent from "../components/input.component";
import FormComponent from "@/components/form.component";
import { apiGetDistricts, apiPostDistricts } from "@/apis/district.api";
import {
  apiGetSubdistricts,
  apiPostSubdistricts,
} from "@/apis/subdistrict.api";
import { apiPostVoters } from "@/apis/voter.api";

import { useQuery } from "react-query";
import Link from "next/link";

interface IHomepageProps {}

type TMarriageStatus = "B" | "S";
type Gender = "P" | "L";

// Keys
// KECAMATAN
// KELURAHAN
// NKK
// NIK
// NAMA
// TEMPAT LAHIR
// TANGGAL LAHIR
// STS KAWIN
// KELAMIN
// ALAMAT
// RT
// RW
// TPS
export interface IVoter {
  districtName: string;
  subdistrictName: string;
  familyCardNumber: string;
  individualCardNumber: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  marriageStatus: TMarriageStatus;
  gender: Gender;
  address: string;
  neighbourhood: string;
  hamlet: string;
  pollingPlaceNumber: number;
}

async function sendDataInBatches(array: IVoter[], batchSize: number) {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);

    const resp = await apiPostVoters(batch);

    console.log(`Resp of ${i}, batchLength: ${batch?.length} resp: ${resp}`);
    // Optional: Add a delay between batches to avoid overwhelming the server

    // Send the batch to the backend (using your preferred method, e.g., fetch or XMLHttpRequest)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

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

export type TSubdistricts = {
  [x in string]: TNamed[];
};

const formSchema = yup.object<FormValues>({
  dptFile: yup.mixed().required("please input file"),
});

export type TNamed = { name: string };

const Homepage: React.FC<IHomepageProps> = ({}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { getInputProps, onSubmit } = useForm<FormValues>({
    validate: yupResolver(formSchema),
  });

  const { data: apiDistricts } = useQuery({
    queryKey: "get-districts-query",
    queryFn: apiGetDistricts,
  });

  const { data: apiSubdistricts } = useQuery({
    queryKey: "get-subdistricts-query",
    queryFn: () => apiGetSubdistricts(),
  });

  const districts: TNamed[] = [];
  const subdistricts: TSubdistricts = {};

  function addDistrictNameIfNotExist(name: string) {
    const isExist = districts.findIndex((s) => s.name === name) !== -1;

    if (isExist) {
      return;
    }

    districts.push({ name });
  }
  function addsubDistrictNameIfNotExist(name: string, districtName: string) {
    const isExist =
      !!subdistricts[districtName]?.length &&
      subdistricts[districtName]?.findIndex((s) => s.name === name) !== -1;

    if (isExist) {
      return;
    }

    if (!subdistricts[districtName]?.length) subdistricts[districtName] = [];
    subdistricts[districtName].push({ name });
  }

  function handleSubmit(values: FormValues) {
    const dptFile = values.dptFile;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const sliced = (jsonData as any[]).slice(1);

      // Use jsonData as needed
      console.log("Data parsed: ");
      const voters = sliced.flatMap((a) => {
        const voter: IVoter = {
          districtName: a[0],
          subdistrictName: a[1],
          familyCardNumber: a[2],
          individualCardNumber: a[3],
          name: a[4],
          birthPlace: a[5],
          birthDate: a[6],
          marriageStatus: a[7],
          gender: a[8],
          address: a[9],
          neighbourhood: a[10],
          hamlet: a[11],
          pollingPlaceNumber: a[12],
        };

        if (!voter.name) {
          return [];
        }

        addDistrictNameIfNotExist(voter.districtName);
        addsubDistrictNameIfNotExist(voter.subdistrictName, voter.districtName);
        return voter;
      });

      console.log("Parsed Data: ");
      console.log(voters);

      console.log("Districts: ", districts);
      console.log("Subdistricts: ", subdistricts);

      console.log("Posting: ", districts);
      const respApiPostDistricts = await apiPostDistricts(districts);
      console.log("respApiPostDistricts: ", respApiPostDistricts);

      console.log("Posting: ", subdistricts);
      const respApiPostSubdistricts = await apiPostSubdistricts(subdistricts);
      console.log("respApiPostSubdistricts: ", respApiPostSubdistricts);

      console.log("Posting voters: ", voters);
      const splitters = await sendDataInBatches(voters, 150);
      console.log("Posting splitters: ", splitters);
      // Send the data to backend
      setIsLoading(false);
    };

    setIsLoading(true);
    console.log("Parsing data ...");
    reader.readAsBinaryString(dptFile);
  }

  return (
    <>
      <SEO title={"Price Simulator"} />

      <MainLayout>
        <Text size={"xl"} weight={"bold"}>
          Input Nama Pemilih
        </Text>

        <Card withBorder mt={20}>
          <FormComponent onSubmit={onSubmit(handleSubmit)}>
            <Group align="end" grow>
              <FileInput
                label="File DPT Kota Kendari"
                {...getInputProps("dptFile")}
              />
              <Button loading={isLoading} size="sm" type="submit">
                Chek Data
              </Button>
            </Group>
          </FormComponent>
        </Card>

        <Stack mt={10}>
          <Link href={"/"}>
            <Button w={"100%"}>Back To Homepage</Button>
          </Link>
        </Stack>

        <Card>
          <Title size={16}>Kecamatan</Title>
          <ul>
            {apiDistricts?.data?.map((d: any) => (
              <li key={"district-item" + d.name + d.districtName}>{d.name}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <Title size={16}>Kelurahan</Title>
          <ul>
            {apiSubdistricts?.data?.map((d: any) => (
              <li key={d.name + d.districtName}>
                {d.name} - ({d.districtName})
              </li>
            ))}
          </ul>
        </Card>
      </MainLayout>
    </>
  );
};
export default Homepage;
