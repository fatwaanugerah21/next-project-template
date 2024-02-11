import { apiDeleteResponsiblerVoters, apiGetResponsiblerVotersDuplicate } from "@/apis/responsibler-voter.api";
import MainLayout from "@/layouts/main.layout";
import { Button, Group, Loader, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";

interface ICheckDuplicateProps {}

const CheckDuplicate: React.FC<ICheckDuplicateProps> = ({}) => {
  const {
    data: duplicates,
    refetch: refetchDuplicates,
    isLoading,
  } = useQuery("duplicates-query", {
    queryFn: () => apiGetResponsiblerVotersDuplicate(),
  });

  const subdistrictDuplicates = {};
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
      text: isSuccess ? `Berhasil menghapus ${data?.data?.voter?.name} dari ${data?.data?.responsibler?.name}` : `Gagal menghapus ${data?.data?.voter?.name} dari ${data?.data?.responsibler?.name}`,
    });

    refetchDuplicates();
  }

  async function deleteFromddd(ddd: any) {
    await mutate(ddd.id);
    refetchDuplicates();
  }

  duplicates?.data?.forEach((rv: any) => {
    const first = rv[0];
    if (!(subdistrictDuplicates as any)[first.voter.subdistrictName]) {
      (subdistrictDuplicates as any)[first.voter.subdistrictName] = 1;
    } else {
      (subdistrictDuplicates as any)[first.voter.subdistrictName] += 1;
    }
  });

  return (
    <MainLayout>
      <Title align="center">Total Daftar Pemilih Yang Duplikat ({duplicates?.data?.length} Orang)</Title>

      <Stack p={"md"} style={{ border: "solid 1px #F0F0F0", borderRadius: "1rem" }} mt={16}>
        {!!isLoading ? (
          <Loader />
        ) : (
          Object.keys(subdistrictDuplicates).map((subdistrictName) => {
            return (
              <Group key={`subdistrict-duplicte-${subdistrictName}`}>
                <Text>
                  {subdistrictName} : {(subdistrictDuplicates as any)[subdistrictName]} Orang
                </Text>

                <Link href={`/check-duplicate/${subdistrictName}`}>
                  <Button>Detail</Button>
                </Link>
              </Group>
            );
          })
        )}
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
