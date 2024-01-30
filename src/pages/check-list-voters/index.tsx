import { apiGetDistricts } from "@/apis/district.api";
import {
  apiDeleteResponsibler,
  apiGetResponsiblers,
} from "@/apis/responsibler.api";
import { apiGetSubdistricts } from "@/apis/subdistrict.api";
import TableComponent, {
  IFETableRowColumnProps,
  THead,
} from "@/components/table/table.component";
import { COLORS } from "@/constants/colors.contant";
import MainLayout from "@/layouts/main.layout";
import { getUUID } from "@/utils/function.util";
import {
  Button,
  Group,
  Select,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";

interface ICheckListVoterProps {}

const CheckListVoter: React.FC<ICheckListVoterProps> = ({}) => {
  const { push } = useRouter();

  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>("");
  const [votingPlaceNumber, setVotingPlaceNumber] = useState<string>("");

  const {
    data: responsiblers,
    refetch: refetchResponsiblers,
    isLoading: isFetchingResponsiblers,
  } = useQuery({
    queryFn: () =>
      apiGetResponsiblers({
        districtName: selectedDistrict,
        subdistrictName: selectedSubdistrict,
        votingPlaceNumber: votingPlaceNumber,
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
      rowKey: "status",
      rowTextAlign: "left",
      title: "Status",
      width: "1rem",
    },

    {
      rowKey: "districtName",
      rowTextAlign: "left",
      title: "Kecamatan",
      width: "1rem",
    },
    {
      rowKey: "subdistrictName",
      rowTextAlign: "left",
      title: "Kelurahan",
      width: "1rem",
    },
    {
      rowKey: "vottingPlaceNumber",
      rowTextAlign: "left",
      title: "TPS",
      width: "1rem",
    },
    {
      rowKey: "phoneNumber",
      rowTextAlign: "left",
      title: "Nomor Telepon",
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
        id: rd.id,
        key: getUUID(),
        number: idx + 1,
        isKip: rd?.isKip ? "KIP" : "-",
        status: rd?.status?.replace("undefined", "-") || "",
        name: rd?.name?.replace("undefined", "-") || "",
        coordinatorName: rd?.coordinatorName?.replace("undefined", "-") || "",
        phoneNumber: rd?.phoneNumber?.replace("undefined", "-") || "",
        votersAmt: rd?.responsiblerVoters?.length || "-",
        districtName: rd?.districtName?.replace("undefined", "-") || "",
        subdistrictName: rd?.subdistrictName?.replace("undefined", "-") || "",
        vottingPlaceNumber:
          rd?.vottingPlaceNumber?.replace("undefined", "-") || "",
      };
      return d;
    }
  );

  const { mutate: deleteResponsibler } = useMutation({
    mutationKey: "delete-responsibler-api",
    mutationFn: apiDeleteResponsibler,
    onSuccess: () => {
      refetchResponsiblers();
    },
  });

  const { data: districts, isLoading } = useQuery("districts", {
    queryFn: apiGetDistricts,
  });
  const districtsData = districts?.data.map((d: any) => ({
    value: d.name,
    label: d.name,
  }));

  const {
    data: subdistricts,
    refetch: refetchSubdistricts,
    isLoading: isLoadingSubdistricts,
  } = useQuery("subdistricts", {
    queryFn: () => apiGetSubdistricts(selectedDistrict!),
    enabled: !!selectedDistrict,
  });

  useEffect(() => {
    refetchSubdistricts();
  }, [selectedDistrict]);

  const subdistrictsData = subdistricts?.data.map((d: any) => ({
    value: d.name,
    label: d.name,
  }));

  useEffect(() => {
    refetchSubdistricts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrict]);

  function handleFilterClicked() {
    refetchResponsiblers();
  }

  return (
    <Stack p={"lg"}>
      <Title mt={16} align="center">
        Daftar Pemilih
      </Title>

      <Group align="end" grow>
        <Select
          label="Pilih Kecamatan"
          searchable
          data={districtsData || []}
          disabled={isLoading}
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e || "");
          }}
        />
        <Select
          searchable
          label="Pilih Kelurahan"
          value={selectedSubdistrict}
          onChange={(e) => {
            setSelectedSubdistrict(e || "");
          }}
          data={subdistrictsData || []}
          disabled={isLoadingSubdistricts || !selectedDistrict}
        />
        <TextInput
          label="Input TPS"
          type="number"
          value={votingPlaceNumber + ""}
          onChange={(e) => {
            setVotingPlaceNumber(e.target.value);
          }}
          disabled={!selectedSubdistrict}
        />

        <Button
          loading={isFetchingResponsiblers}
          disabled={
            !selectedDistrict && !selectedSubdistrict && !votingPlaceNumber
          }
          onClick={handleFilterClicked}
        >
          Aktifkan Filter
        </Button>
      </Group>

      {!isLoadingSubdistricts ? (
        <TableComponent
          elements={elements}
          heads={heads}
          isLoading={isFetchingResponsiblers}
          actions={[
            {
              buttonBackground: COLORS.BLUE,
              label: "Detail",
              onClick: (r) => {
                push(`/check-list-voters/${r.id}`);
              },
            },
            {
              buttonBackground: COLORS.DANGER,
              label: "Hapus",
              onClick: async (r) => {
                const { isConfirmed } = await Swal.fire({
                  title: "Hapus Penanggung Jawab",
                  text: `Hapus ${r.name}?`,
                  confirmButtonText: "Hapus",
                });

                if (!isConfirmed) return;
                deleteResponsibler(parseInt(r.id as string));
              },
            },
          ]}
        />
      ) : (
        <></>
      )}
    </Stack>
  );
};
export default CheckListVoter;
