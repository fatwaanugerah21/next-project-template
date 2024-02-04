import { Button, Card, Group, Stack, Title } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface IHomepageProps {}

const Homepage: React.FC<IHomepageProps> = ({}) => {
  return (
    <Group align="center" position="center" bg={"gray"} mih={"100vh"}>
      <Card>
        <Title align="center" size={24}>
          Program Check Data Pemilih
        </Title>

        <Stack mt={24}>
          {/* <Link href={"/dpt"}>
            <Button w={"100%"} mt={10} color="light">
              Input Data DPT
            </Button>
          </Link> */}
          <Link href={"/coordinators"}>
            <Button w={"100%"} mt={10} color="light">
              Input Data Koordinator Dan Penanggung Jawab
            </Button>
          </Link>
          <Link href={"/voters"}>
            <Button w={"100%"} mt={10} color="light">
              Input Data Pemilih
            </Button>
          </Link>
          <Link href={"/check-duplicate"}>
            <Button w={"100%"} mt={10} color="light">
              Check Duplikat
            </Button>
          </Link>
          <Link href={"/check-list-voters"}>
            <Button w={"100%"} mt={10} color="light">
              Check Daftar Pemilih
            </Button>
          </Link>
        </Stack>
      </Card>
    </Group>
  );
};
export default Homepage;
