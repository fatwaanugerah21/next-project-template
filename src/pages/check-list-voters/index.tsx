import { apiGetResponsiblers } from "@/apis/responsibler.api";
import TableComponent, {
  IFETableRowColumnProps,
  THead,
} from "@/components/table/table.component";
import { COLORS } from "@/constants/colors.contant";
import MainLayout from "@/layouts/main.layout";
import { Stack, Table, Title } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

interface ICheckListVoterProps {}

const CheckListVoter: React.FC<ICheckListVoterProps> = ({}) => {
  const { push } = useRouter();
  const { data: responsiblers } = useQuery({
    queryFn: () =>
      apiGetResponsiblers({
        districtName: "",
        subdistrictName: "",
        votingPlaceNumber: "",
      }),
  });

  const heads: THead[] = [
    {
      rowKey: "number",
      rowTextAlign: "center",
      title: "No.",
      width: "0.1rem",
    },
    {
      rowKey: "isKip",
      rowTextAlign: "center",
      title: "KIP",
      width: "0.1rem",
    },
    {
      rowKey: "individualCardNumber",
      rowTextAlign: "left",
      title: "NIK",
      width: "1rem",
    },
    {
      rowKey: "name",
      rowTextAlign: "left",
      title: "Name",
      width: "1rem",
    },
    {
      rowKey: "coordinatorName",
      rowTextAlign: "left",
      title: "Nama Koordinator",
      width: "1rem",
    },
    {
      rowKey: "phoneNumber",
      rowTextAlign: "left",
      title: "Nomor Telepon",
      width: "1rem",
    },
    {
      rowKey: "status",
      rowTextAlign: "left",
      title: "Jumlah Pemilih",
      width: "1rem",
    },
    {
      rowKey: "votersAmt",
      rowTextAlign: "left",
      title: "Jumlah Pemilih",
      width: "1rem",
    },
  ];

  const elements: IFETableRowColumnProps[] = responsiblers?.data?.map(
    (rd: any, idx: number) => {
      const d = {
        id: rd?.id,
        number: idx + 1,
        isKip: rd?.isKip ? "KIP" : "-",
        individualCardNumber:
          rd?.individualCardNumber?.replace("undefined", "-") || "",
        name: rd?.name?.replace("undefined", "-") || "",
        coordinatorName: rd?.coordinatorName?.replace("undefined", "-") || "",
        phoneNumber: rd?.phoneNumber?.replace("undefined", "-") || "",
        votersAmt: rd?.responsiblerVoters?.length || "-",
        status: rd?.status?.replace("undefined", "-") || "",
      };
      return d;
    }
  );

  return (
    <Stack p={"lg"}>
      <Title mt={16} align="center">
        Daftar Pemilih
      </Title>

      <TableComponent
        elements={elements}
        heads={heads}
        actions={[
          {
            buttonBackground: COLORS.BLUE,
            label: "Detail",
            onClick: (r) => {
              push(`/check-list-voters/${r.id}`);
            },
          },
        ]}
      />
    </Stack>
  );
};
export default CheckListVoter;
