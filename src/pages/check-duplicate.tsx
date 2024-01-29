import {
  apiDeleteResponsiblerVoters,
  apiGetResponsiblerVotersDuplicate,
} from "@/apis/responsibler-voter.api";
import MainLayout from "@/layouts/main.layout";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";

interface ICheckDuplicateProps {}

const CheckDuplicate: React.FC<ICheckDuplicateProps> = ({}) => {
  const { data: duplicates, refetch: refetchDuplicates } = useQuery(
    "duplicates-query",
    {
      queryFn: apiGetResponsiblerVotersDuplicate,
    }
  );

  console.log("duplicates: ", duplicates);
  const { mutate } = useMutation({
    mutationKey: "duplicate-mutation-remove",
    mutationFn: apiDeleteResponsiblerVoters,
    onSuccess: handleDeletedDDD,
  });

  function handleDeletedDDD(data: any) {
    const isSuccess = data.code === 200;

    Swal.fire({
      icon: isSuccess ? "success" : "error",
      title: isSuccess ? `Berhasil Menghapus` : `Gagal Menghapus`,
      text: isSuccess
        ? `Berhasil menghapus ${data?.data?.voter?.name} dari ${data?.data?.responsibler?.name}`
        : `Gagal menghapus ${data?.data?.voter?.name} dari ${data?.data?.responsibler?.name}`,
    });

    refetchDuplicates();
  }

  async function deleteFromddd(ddd: any) {
    await mutate(ddd.id);
    refetchDuplicates();
  }
  return (
    <MainLayout>
      <Title align="center">
        Daftar Pemilih Yang Duplikat ({duplicates?.data?.length} Orang)
      </Title>

      <Stack
        p={"md"}
        style={{ border: "solid 1px #F0F0F0", borderRadius: "1rem" }}
        mt={16}
      >
        {duplicates?.data?.map((rv: any) => {
          const first = rv[0];
          return (
            <Stack key={first.id + "dd-duplicate"}>
              <Title size={20}>
                {first.voter.name} - {first.voter.individualCardNumber} -{" "}
                {first.voter.districtName} - {first.voter.subdistrictName} - TPS{" "}
                {first.voter.pollingPlaceNumber}
              </Title>

              {rv.map((ddd: any) => {
                return (
                  <Group key={ddd.responsibler.name + rv.id}>
                    <Text>
                      {ddd.responsibler.name} -{" "}
                      {ddd.responsibler.coordinatorName} (
                      {ddd.responsibler.responsiblerVoters?.length} Orang yang
                      ditangani)
                    </Text>

                    <Button onClick={() => deleteFromddd(ddd)}>
                      &#10005; Hapus Dari {ddd.responsibler.name}
                    </Button>
                  </Group>
                );
              })}
            </Stack>
          );
        })}
      </Stack>

      <Stack my={8}>
        <Link href={"/"}>
          <Button w={"100%"}>Back To Homepage</Button>
        </Link>
      </Stack>
    </MainLayout>
  );
};
export default CheckDuplicate;
