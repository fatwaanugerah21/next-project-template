import { apiGetDistricts } from "@/apis/district.api";
import {
  apiCreateResponsiblerVoter,
  apiDeleteResponsiblerVoters,
  apiGetResponsiblerVoters,
} from "@/apis/responsibler-voter.api";
import { apiGetResponsiblers } from "@/apis/responsibler.api";
import { apiGetSubdistricts } from "@/apis/subdistrict.api";
import { apiGetVoters } from "@/apis/voter.api";
import MainLayout from "@/layouts/main.layout";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  Group,
  Input,
  Loader,
  Select,
  Space,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import Link from "next/link";
import FormComponent from "@/components/form.component";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

interface IVotersPageProps {}
const queryClient = new QueryClient();

const VotersPage: React.FC<IVotersPageProps> = ({}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string | null>(
    null
  );
  const [votingPlaceNumber, setVotingPlaceNumber] = useState<string | null>(
    null
  );
  const [selectedVoter, setSelectedVoter] = useState<string | null>(null);
  const [selectedResponsibler, setSelectedResponsibler] = useState<
    string | null
  >(null);

  useEffect(() => {
    refetchResponsiblerVoters();
  }, [selectedResponsibler]);

  const { data: districts, isLoading } = useQuery("districts", {
    queryFn: apiGetDistricts,
  });

  const {
    data: subdistricts,
    refetch: refetchSubdistricts,
    isLoading: isLoadingSubdistricts,
  } = useQuery("subdistricts", {
    queryFn: () => apiGetSubdistricts(selectedDistrict!),
    enabled: !!selectedDistrict,
  });

  const {
    data: responsiblers,
    refetch: refetchResponsiblers,
    isLoading: isLoadingResponsiblers,
  } = useQuery("responsiblers", {
    queryFn: () =>
      apiGetResponsiblers({
        districtName: selectedDistrict!,
        subdistrictName: selectedSubdistrict!,
      }),
    enabled: !!selectedDistrict && !!selectedSubdistrict,
  });

  const {
    data: voters,
    refetch: refetchVoters,
    isLoading: isLoadingVoters,
  } = useQuery("voters", {
    queryFn: () =>
      apiGetVoters({
        districtName: selectedDistrict!,
        subdistrictName: selectedSubdistrict!,
        votingPlaceNumber: votingPlaceNumber!,
      }),
    enabled: false,
  });

  const {
    data: responsiblerVoters,
    isLoading: isFetchingResponsiblerVoters,
    refetch: refetchResponsiblerVoters,
  } = useQuery("responsiblerVoters", {
    queryFn: () =>
      apiGetResponsiblerVoters({
        responsiblerId: parseInt(selectedResponsibler!),
      }),
    enabled: !!selectedResponsibler,
  });

  useEffect(() => {
    refetchSubdistricts();
  }, [selectedDistrict]);

  const districtsData = districts?.data.map((d: any) => ({
    value: d.name,
    label: d.name,
  }));

  const voterSelectRef = useRef(null);

  const subdistrictsData = subdistricts?.data.map((d: any) => ({
    value: d.name,
    label: d.name,
  }));

  const responsiblersData = responsiblers?.data.map((r: any) => ({
    value: r.id + "",
    label: `${r.name} - ${r.status} - ${r.coordinatorName} - TPS ${r.vottingPlaceNumber} ${r.subdistrictName} - Terinput ${r.realVoter} Suara`,
  }));

  const { mutate, isLoading: isCreatingRV } = useMutation({
    mutationKey: "create-responsibler-voter",
    mutationFn: apiCreateResponsiblerVoter,
    onSuccess: handleFinishCreatingRVAttempt,
  });
  const votersData = voters?.data.map((d: any) => ({
    value: d.id + "",
    label: `${d.name} - ${d.birthPlace}, ${d.birthDate} - ${d.districtName} - ${d.subdistrictName} - TPS ${d.pollingPlaceNumber} - ${d.individualCardNumber}`,
  }));

  function handleFinishCreatingRVAttempt(resp: any) {
    const isSuccess = resp.code === 200;
    Swal.fire({
      icon: isSuccess ? "success" : "error",
      title: isSuccess ? "Sukses" : "Gagal",
      text: resp.message,
    });

    refetchResponsiblerVoters();
  }

  function handleSubmit() {
    if (!selectedVoter || !selectedResponsibler) {
      return;
    }

    mutate({
      responsiblerId: parseInt(selectedResponsibler),
      voterId: parseInt(selectedVoter),
    });

    setSelectedVoter(null);

    (voterSelectRef?.current as any)?.focus();
  }

  async function deleteResponsiblerVoter(rv: any) {
    const resp = await apiDeleteResponsiblerVoters(rv.id);

    refetchResponsiblerVoters();
    queryClient.invalidateQueries("responsiblerVoters");

    const isSuccess = resp.code === 200;

    Swal.fire({
      icon: isSuccess ? "success" : "error",
      title: isSuccess ? "Berhasil Mengahpus" : "Gagal Menghapus",
      text: resp.message,
    });
  }

  function handleRefreshVotersList() {
    refetchVoters();
  }

  return (
    <MainLayout>
      <Title>Input Data Pemilih</Title>

      <Stack
        p={"md"}
        style={{ border: "solid 1px #F0F0F0", borderRadius: "1rem" }}
        mt={12}
      >
        <Group grow>
          <Select
            label="Pilih Kecamatan"
            searchable
            clearable
            data={districtsData || []}
            disabled={isLoading}
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e);
              setSelectedSubdistrict(null);
              setVotingPlaceNumber(null);
              setSelectedVoter(null);
            }}
          />
          <Select
            searchable
            label="Pilih Kelurahan"
            value={selectedSubdistrict}
            onChange={(e) => {
              setSelectedSubdistrict(e);
              setVotingPlaceNumber(null);
              setSelectedVoter(null);
            }}
            clearable
            data={subdistrictsData || []}
            disabled={isLoadingSubdistricts}
          />
          <TextInput
            label="Input TPS"
            type="number"
            value={votingPlaceNumber + ""}
            onChange={(e) => {
              setVotingPlaceNumber(e.target.value);
              setSelectedVoter(null);
            }}
            onBlur={() => refetchResponsiblers()}
          />
        </Group>

        <Select
          mt={16}
          value={selectedResponsibler + ""}
          label="Pilih Penanggung Jawab"
          onChange={async (e) => {
            setSelectedResponsibler(e);
          }}
          data={responsiblersData || []}
          searchable
          disabled={isLoadingResponsiblers}
        />
      </Stack>

      <Stack
        p={"md"}
        style={{ border: "solid 1px #F0F0F0", borderRadius: "1rem" }}
        mt={16}
      >
        <Title size={20}>Daftar Pemilih</Title>
        <Button w={"fit-content"} my={0} onClick={handleRefreshVotersList}>
          Refresh List Pemilih &#x21bb;
        </Button>
        <FormComponent onSubmit={handleSubmit}>
          <Select
            ref={voterSelectRef}
            mt={16}
            label="Pilih Pemilih"
            value={selectedVoter + ""}
            onChange={(e) => {
              setSelectedVoter(e);
            }}
            data={votersData || []}
            searchable
            disabled={isLoadingVoters}
          />
          <Button
            disabled={!selectedVoter || !selectedResponsibler}
            loading={isCreatingRV}
            mt={12}
            w={"100%"}
            type="submit"
          >
            Tambah
          </Button>
        </FormComponent>

        <Stack>
          <Button
            w={"10rem"}
            variant="outline"
            onClick={() => refetchResponsiblerVoters()}
          >
            Refresh &#x21bb;
          </Button>
          {isFetchingResponsiblerVoters ? (
            <Loader />
          ) : (
            <Stack>
              <Title size={"sm"}>
                Jumlah Pemilih ({responsiblerVoters?.data?.length} Orang)
              </Title>
              {responsiblerVoters?.data.map((rv: any) => (
                <Group
                  key={
                    rv.voter.name + rv.voter.individualCardNumber + "voterre"
                  }
                >
                  <Title size={12}>
                    - {rv.voter.name} - {rv.voter.birthPlace},{" "}
                    {rv.voter.birthDate} - {rv.voter.districtName} -{" "}
                    {rv.voter.subdistrictName} - TPS{" "}
                    {rv.voter.pollingPlaceNumber}
                  </Title>

                  <Button
                    size="xs"
                    p={4}
                    onClick={() => deleteResponsiblerVoter(rv)}
                  >
                    Hapus &#10005;
                  </Button>
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>

      <Space h={24} />

      <Stack mb={8}>
        <Link href={"/"}>
          <Button w={"100%"}>Back To Homepage</Button>
        </Link>
      </Stack>
    </MainLayout>
  );
};
export default VotersPage;
