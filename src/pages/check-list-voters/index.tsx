import { apiGetDistricts } from "@/apis/district.api";
import { apiGetInputtedResponsiblerVotersDistrictAndSubdistrict } from "@/apis/responsibler-voter.api";
import {
  apiDeleteResponsibler,
  apiGetResponsiblers,
  apiGetResponsiblersWithVoters,
} from "@/apis/responsibler.api";
import { apiGetSubdistricts } from "@/apis/subdistrict.api";
import TableComponent, {
  IFETableRowColumnProps,
  THead,
} from "@/components/table/table.component";
import { COLORS } from "@/constants/colors.contant";
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
import { QueryClient, useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";

interface ICheckListVoterProps {}

const CheckListVoter: React.FC<ICheckListVoterProps> = ({}) => {
  const { push } = useRouter();

  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>("");

  const { data: inputtedDistrictsAndSubdistricts } = useQuery({
    queryKey: "inputted-districts-and-subdistrict",
    queryFn: () => apiGetInputtedResponsiblerVotersDistrictAndSubdistrict(),
  });

  const inputtedDistricts: { [x in string]: string[] } = {};

  inputtedDistrictsAndSubdistricts?.data?.forEach(
    (das: { districtName: string; subdistrictName: string }) => {
      console.log("Das: ", das);
      if (!inputtedDistricts[das.districtName]?.length) {
        inputtedDistricts[das.districtName] = [];
      }

      inputtedDistricts[das.districtName].push(das.subdistrictName);
    }
  );

  const {
    data: responsiblers,
    refetch: refetchResponsiblers,
    isLoading: isFetchingResponsiblers,
  } = useQuery({
    queryKey: "inputted-responsiblers-with-rv",
    queryFn: () =>
      apiGetResponsiblersWithVoters({
        districtName: selectedDistrict,
        subdistrictName: selectedSubdistrict,
      }),
    enabled: !!selectedDistrict,
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
    const qc = new QueryClient();
    qc.invalidateQueries("inputted-responsiblers-with-rv");
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

  function showInputtedDistrictsAndSubdistricts() {
    Swal.fire({
      icon: "success",
      title: "Kecamatan Dan Kelurahan yang Sudah di Input",
      html: `
      ${Object.keys(inputtedDistricts).map((key: string) => {
        return `
        <h4>${key} (${inputtedDistricts[key].length} Kelurahan)</h4>
        <div>
        ${inputtedDistricts[key]
          .map((val: string) => {
            return `<span> ${val.replace(",", "")}</span>`;
          })
          .join(" | ")}
        </div>
        `;
      })}
      `.replaceAll(",", ""),
    });
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
          clearable
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e || "");
            setSelectedSubdistrict("");
          }}
        />
        <Select
          searchable
          label="Pilih Kelurahan"
          value={selectedSubdistrict}
          clearable
          onChange={(e) => {
            setSelectedSubdistrict(e || "");
          }}
          data={subdistrictsData || []}
          disabled={isLoadingSubdistricts || !selectedDistrict}
        />

        <Button
          loading={isFetchingResponsiblers}
          disabled={!selectedDistrict && !selectedSubdistrict}
          onClick={handleFilterClicked}
        >
          Aktifkan Filter
        </Button>
      </Group>

      <Button onClick={showInputtedDistrictsAndSubdistricts}>
        Kecamatan dan Kelurahan Yang Sudah di Input
      </Button>

      {!isLoadingSubdistricts ? (
        <TableComponent
          elements={elements}
          heads={heads}
          emptyLabel={!selectedDistrict ? "Pilih Kecamatan" : "Data tidak ada"}
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
