import { apiGetResponsiblerVoters } from "@/apis/responsibler-voter.api";
import { apiGetDetailResponsibler } from "@/apis/responsibler.api";
import ExportToExcelButton from "@/components/export-to-excel.component";
import TableComponent, { IFETableRowColumnProps, THead } from "@/components/table/table.component";
import { Button, Stack, Table, Title } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

interface ICheckListVoterProps {}

const CheckListVoter: React.FC<ICheckListVoterProps> = ({}) => {
  const { query } = useRouter();

  const { data: responsiblerDetail } = useQuery({
    queryKey: "responsibler-detail",
    queryFn: () => apiGetDetailResponsibler(parseInt(query.id as string)),
    enabled: !!query.id,
  });

  const { data: responsiblerVoters } = useQuery({
    queryKey: "apiGetResponsiblerVoters",
    queryFn: () =>
      apiGetResponsiblerVoters({
        responsiblerId: parseInt(query.id as string),
      }),
    enabled: !!query.id,
  });

  const heads: THead[] = [
    {
      rowKey: "number",
      rowTextAlign: "center",
      title: "No.",
      width: "1rem",
    },
    {
      rowKey: "familyCardNumber",
      rowTextAlign: "left",
      title: "NKK",
      width: "1rem",
    },
    {
      rowKey: "individualCardNumber",
      rowTextAlign: "left",
      title: "NIK",
      width: "0.1rem",
    },
    {
      rowKey: "name",
      rowTextAlign: "left",
      title: "Name",
      width: "1rem",
    },
    {
      rowKey: "address",
      rowTextAlign: "left",
      title: "Alamat",
      width: "11rem",
    },
    {
      rowKey: "district",
      rowTextAlign: "center",
      title: "Kecamatan",
      width: "1rem",
    },
    {
      rowKey: "subdistrict",
      rowTextAlign: "center",
      title: "Kelurahan",
      width: "1rem",
    },
    {
      rowKey: "votingPlaceNumber",
      rowTextAlign: "center",
      title: "TPS",
      width: "1rem",
    },
  ];

  const elements: IFETableRowColumnProps[] = responsiblerVoters?.data?.map((rv: any, idx: number) => {
    const rd = rv.voter;
    const d = {
      id: rd?.id + rd?.individualCardNumber + rd?.name + "voter-vr" + idx,
      number: idx + 1,
      familyCardNumber: rd?.familyCardNumber?.replace("undefined", "-") || "",
      individualCardNumber: rd?.individualCardNumber?.replace("undefined", "-") || "",
      address: rd?.address,
      name: rd?.name?.replace("undefined", "-") || "",
      district: rd?.districtName,
      subdistrict: rd?.subdistrictName,
      votingPlaceNumber: rd?.pollingPlaceNumber,
      isDuplicate: rd?.isDuplicate,
    };
    return d;
  });

  return (
    <Stack p={"lg"}>
      <Title mt={16} align="center">
        Daftar Pemilih yang ditangani `{responsiblerDetail?.data?.name} - {responsiblerDetail?.data.isKip ? "Pak Nuzul" : responsiblerDetail?.data?.coordinatorName}
        {responsiblerDetail?.data?.isKip ? " (KIP) " : ""}` ({elements?.length} Orang)
      </Title>
      <ExportToExcelButton
        data={elements?.map((m: any, idx) => {
          return {
            No: idx + 1,
            "Nama Pemilih": m.name,
            Alamat: m.address,
            Kecamatan: m.district,
            Kelurahan: m.subdistrict,
            TPS: `TPS ${m.votingPlaceNumber}`,
            isDuplicate: m.isDuplicate,
          };
        })}
        filename={`(${process.env.NEXT_PUBLIC_API_TARGET_TYPE}) DPT Untuk ${responsiblerDetail?.data?.name} - ${responsiblerDetail?.data.isKip ? "Pak Nuzul" : responsiblerDetail?.data?.coordinatorName}`}
        sheetname="List Pemilih"
        heading={{
          good1: " ",
          title: `Daftar Pemilih yang ditangani ${responsiblerDetail?.data?.name} - ${responsiblerDetail?.data.isKip ? "Pak Nuzul" : responsiblerDetail?.data?.coordinatorName} ${responsiblerDetail?.data?.isKip ? " (KIP) " : ""}(${elements?.length} Orang)`,
        }}
      />
      <TableComponent emptyLabel="Tidak Ada Data" elements={elements} heads={heads} />
      <Stack mt={10}>
        <Link href={"/check-list-voters"}>
          <Button w={"100%"}>Kembali ke Daftar List Pemilih</Button>
        </Link>
      </Stack>
    </Stack>
  );
};
export default CheckListVoter;
