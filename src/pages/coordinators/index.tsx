import FormComponent from "@/components/form.component";
import MainLayout from "@/layouts/main.layout";
import * as XLSX from "xlsx";
import {
  Card,
  Group,
  FileInput,
  Button,
  Stack,
  TextInput,
  Radio,
  Space,
  Title,
  Select,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import {
  apiDeleteAllResponsiblers,
  apiDeleteResponsibler,
  apiPostResponsibler,
  apiPostResponsiblers,
} from "@/apis/responsibler.api";
import Link from "next/link";
import { useMutation, useQuery } from "react-query";
import { apiGetDistricts } from "@/apis/district.api";
import { apiGetSubdistricts } from "@/apis/subdistrict.api";
import Swal from "sweetalert2";
import { COLORS } from "@/constants/colors.contant";
import { useRouter } from "next/router";

interface ICoordinatorPageProps {}

type FileFormValues = {
  coordinatorFile: File;
};

const fileFormSchema = yup.object<FileFormValues>({
  coordinatorFile: yup.mixed().required("please input file"),
});

// Responsible Row
// 0:"KIP"
// 1:"KENDARI BARAT"
// 2:"WATU-WATU"
// 3:"TPS"
// 4:1
// 5:"7471050506010001"
// 6:"HIRAYANA WIRA SAKTI TUHATELU"
// 7:"JL. BUNGA KANA NO. 7"
// 8:"MANAJEMEN 2021"
// 9:"082231016762"
// 10:2
// 11:"OM BOB"
export type TResponsibler = {
  isKip: boolean;
  districtName: string;
  subdistrictName: string;
  vottingPlaceNumber: string;
  individualCardNumber: string;
  name: string;
  address: string;
  status: string;
  phoneNumber: string;
  realVoter: number;
  coordinatorName: string;
};

const responsiblerFormSchema = yup.object<TResponsibler>({
  districtName: yup.string().required("input kecamatan"),
  subdistrictName: yup.string().required("input kelurahan"),
  vottingPlaceNumber: yup.string().required("input tps"),
  name: yup.string().required("input nama penanggung jawab"),
  address: yup.string().required("input alamat"),
  status: yup.string().required("input status penanggung jawab"),
  phoneNumber: yup.string().required("input nomor hp"),
  coordinatorName: yup.string().required("input nama koordinator"),
});

async function sendDataInBatches(array: TResponsibler[], batchSize: number) {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);

    const resp = await apiPostResponsiblers(batch);

    console.log(`Resp of ${i}, batchLength: ${batch?.length} resp:`, resp);

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

const CoordinatorPage: React.FC<ICoordinatorPageProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { getInputProps: getFileInputProps, onSubmit: onFileSubmit } =
    useForm<FileFormValues>({
      validate: yupResolver(fileFormSchema),
    });

  const {
    getInputProps: getResponsiblerInputProps,
    onSubmit: onResponsiblerSubmit,
    values,
    reset,
  } = useForm<TResponsibler>({
    validate: yupResolver(responsiblerFormSchema),
  });

  const { data: districts } = useQuery({
    queryKey: "list-kecamatan",
    queryFn: apiGetDistricts,
  });
  const apiDistricts = districts?.data?.map((d: any) => ({
    value: d.name,
    label: d.name,
  }));
  const { data: subdistricts, refetch: refetchSubdistricts } = useQuery({
    queryKey: "list-kelurahan",
    queryFn: () => apiGetSubdistricts(values.districtName),
    // enabled: !!values.districtName,
  });

  useEffect(() => {
    refetchSubdistricts();
  }, [values.districtName]);
  const apiSubdistricts = subdistricts?.data?.map((d: any) => ({
    value: d.name,
    label: d.name,
  }));

  function handleFileSubmit(values: FileFormValues) {
    const dptFile = values.coordinatorFile;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const sliced = (jsonData as any[]).slice(1);

      const duplicateName: { [x in string]: boolean } = {};

      let districtAbove = "";
      let subdistrictAbove = "";
      let tpsAbove = "";
      const responsiblers = sliced.flatMap((s) => {
        if (!!s[1]) districtAbove = s[1] + "";
        if (!!s[2]) subdistrictAbove = s[2] + "";
        if (!!s[4]) tpsAbove = s[4] + "";

        const responsibler: TResponsibler = {
          isKip: !!s[0],
          districtName: districtAbove,
          subdistrictName: subdistrictAbove,
          vottingPlaceNumber: tpsAbove,
          individualCardNumber: s[5] + "",
          name: s[6] + "",
          address: s[7] + "",
          status: s[8] + "",
          phoneNumber: s[9] + "",
          coordinatorName: s[11] + "",
          realVoter: parseInt(s[10] || "0"),
        };

        if (responsibler.name === "undefined") {
          return [];
        }
        if (!responsibler.name) return [];

        if (!responsibler.realVoter && responsibler.realVoter !== 0) {
          responsibler.realVoter = 0;
        }

        return responsibler;
      });

      console.log("Responsiblers: ", responsiblers);
      const deleteResponse = await apiDeleteAllResponsiblers();
      console.log("deleteResponse: ", deleteResponse);

      sendDataInBatches(responsiblers, 150);

      // Send the data to backend
      setIsLoading(false);
    };

    setIsLoading(true);
    reader.readAsBinaryString(dptFile);
  }

  const { mutate, isLoading: isPostingResponsibler } = useMutation({
    mutationKey: "add-responsibler-mutation",
    mutationFn: apiPostResponsibler,
    onSuccess: handleSuccessAddResponsiblerAttempt,
  });

  async function handleSuccessAddResponsiblerAttempt(resp: any) {
    const isSuccess = resp.code === 200;

    await Swal.fire({
      icon: isSuccess ? "success" : "error",
      title: isSuccess
        ? "Sukses Menambah Koordinator"
        : "Gagal menambah koordinator",
      text: resp.message,
    });
  }

  async function handleResponsiblerSubmit(s: TResponsibler) {
    const responsibler: TResponsibler = {
      isKip: !!s.isKip,
      districtName: s.districtName,
      subdistrictName: s.subdistrictName,
      vottingPlaceNumber: s.vottingPlaceNumber,
      individualCardNumber: s.individualCardNumber,
      name: s.name,
      address: s.address,
      status: s.status,
      phoneNumber: s.phoneNumber,
      coordinatorName: s.coordinatorName,
      realVoter: parseInt(s.realVoter + "") || 0,
    };

    const resp = await mutate(responsibler);
  }

  const { query } = useRouter();

  return (
    <MainLayout>
      <Stack mt={10}>
        <Link href={"/"}>
          <Button color={COLORS.BLUE} w={"100%"}>
            Back To Homepage
          </Button>
        </Link>
      </Stack>
      {query.isWithFile && (
        <Card withBorder mt={20}>
          <Title align="center" mb={10}>
            Input Pakai File Excel
          </Title>
          <FormComponent onSubmit={onFileSubmit(handleFileSubmit)}>
            <Group align="end" grow>
              <FileInput
                label="File Koordinator dan Penanggung Jawab"
                {...getFileInputProps("coordinatorFile")}
                placeholder="koordinator.xlsx"
              />
              <Button loading={isLoading} size="sm" type="submit">
                Import Semua Data Excel
              </Button>
            </Group>
          </FormComponent>
        </Card>
      )}

      <Card withBorder mt={20}>
        <Title align="center" my={10}>
          Input Satu Satu
        </Title>

        <FormComponent
          onSubmit={onResponsiblerSubmit(handleResponsiblerSubmit)}
        >
          <Stack spacing={"md"}>
            <TextInput
              placeholder="74719123412"
              label="NIK Penanggung Jawab"
              {...getResponsiblerInputProps("individualCardNumber")}
            />
            <TextInput
              withAsterisk
              placeholder="Fatwa Anugerah"
              label="Nama Penanggung Jawab"
              {...getResponsiblerInputProps("name")}
            />
            <TextInput
              withAsterisk
              placeholder="Om Rusli"
              label="Nama Koordinator"
              {...getResponsiblerInputProps("coordinatorName")}
            />
            <Radio.Group
              withAsterisk
              label="Anggota KIP?"
              {...getResponsiblerInputProps("isKip")}
            >
              <Group>
                <Radio value={"kip"} label="Ya" />
                <Radio value={""} label="Bukan" />
              </Group>
            </Radio.Group>
            <Select
              searchable
              data={apiDistricts || []}
              withAsterisk
              label="Bertanggung Jawab di Kecamatan"
              placeholder="Kendari"
              {...getResponsiblerInputProps("districtName")}
            />
            <Select
              searchable
              data={apiSubdistricts || []}
              withAsterisk
              label="Bertanggung Jawab di Kelurahan"
              placeholder="Kendari Caddi"
              {...getResponsiblerInputProps("subdistrictName")}
            />
            <TextInput
              withAsterisk
              label="Bertanggung Jawab di TPS"
              placeholder="5"
              {...getResponsiblerInputProps("vottingPlaceNumber")}
            />

            <TextInput
              withAsterisk
              label="Alamat Penanggung Jawab"
              placeholder="Jl. R.A Kartini No.10"
              {...getResponsiblerInputProps("address")}
            />
            <TextInput
              withAsterisk
              label="Status Penanggung Jawab"
              placeholder="Keluarga Om Rusli"
              {...getResponsiblerInputProps("status")}
            />
            <TextInput
              withAsterisk
              label="Nomor HP"
              placeholder="085299014599"
              {...getResponsiblerInputProps("phoneNumber")}
            />
            <TextInput
              placeholder="1"
              label="Jumlah Pemilih Yang Ditangani (Boleh tidak diisi)"
              {...getResponsiblerInputProps("realVoter")}
            />
          </Stack>

          <Button
            loading={isPostingResponsibler}
            w={"100%"}
            mt={12}
            type="submit"
          >
            Tambah Penanggung Jawab
          </Button>
        </FormComponent>
      </Card>

      <Space h={24} />
    </MainLayout>
  );
};
export default CoordinatorPage;
