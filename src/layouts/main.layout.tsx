import { Container } from "@mantine/core";
import React, { ReactNode } from "react";

interface IMainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
};
export default MainLayout;
