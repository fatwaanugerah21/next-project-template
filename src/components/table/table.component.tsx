import { Button, Group, Skeleton, Stack, Table, Text } from "@mantine/core";
import { useTranslation } from "next-i18next";
import React from "react";
import TableRowComponent from "./table-row.component";
import { COLORS } from "@/constants/colors.contant";
import { getUUID } from "@/utils/function.util";

interface ITableComponentProps {
  elements?: IFETableRowColumnProps[];
  heads: THead[];
  actions?: TableAction[];
  isLoading?: boolean;
}

type TableRowCellKey = string;

export type THead = {
  title: string;
  width: string;
  rowKey: TableRowCellKey;
  rowTextAlign: TTextAlign;
};

export type TColValue =
  | string
  | number
  | {
      label: string | number;
      element?: JSX.Element | undefined;
    };

export type TTextAlign = "center" | "left" | "right";

export type TableAction = {
  isLoading?: (row: IFETableRowColumnProps) => boolean;
  icon?: React.FC<React.SVGAttributes<{}>>;
  label: string;
  buttonBackground: string;
  onClick: (row: IFETableRowColumnProps) => void;
};

// The key in this object should match rowKey of Head object
export type IFETableRowColumnProps = {
  [x in TableRowCellKey]:
    | {
        label: string | number;
        element?: JSX.Element;
      }
    | number
    | string;
};

export const BORDER_STYLE = `1px solid ${COLORS.dividerColor}`;
export const NO_BORDER_STYLE = `0px solid ${COLORS.dividerColor}`;

const TableComponent: React.FC<ITableComponentProps> = ({
  heads,
  elements = [],
  actions,
  isLoading,
}) => {
  const { t } = useTranslation();

  const emptyData = (
    <tr>
      <td
        colSpan={heads.length + 1}
        style={{ background: "white", height: "32rem" }}
      >
        <Stack align="center">
          <Text
            color={COLORS.PRIMARY}
            mt={"2rem"}
            align="center"
            weight={"bold"}
            size={"lg"}
          >
            {t("Pilih Kecamatan dan Kelurahan")}
          </Text>
        </Stack>
      </td>
    </tr>
  );

  var rows = elements.map((element, rowIdx) => {
    return (
      <TableRowComponent
        key={
          element.key +
          getUUID() +
          element[heads[rowIdx]?.rowKey]?.toString() +
          rowIdx
        }
        rowIdx={rowIdx}
        element={element}
        actions={actions}
        heads={heads}
        isLast={rowIdx === elements.length - 1}
      />
    );
  });

  var loadingEl = (
    <tr>
      <td colSpan={heads.length + 1} style={{ background: COLORS.WHITE }}>
        <Stack spacing={"md"}>
          <Skeleton height={100} width={"100%"} />
          <Skeleton height={100} width={"100%"} />
          <Skeleton height={100} width={"100%"} />
          <Skeleton height={100} width={"100%"} />
        </Stack>
      </td>
    </tr>
  );

  return (
    <Stack
      style={{
        border: BORDER_STYLE,
        borderRadius: ".2rem",
        overflow: "auto",
        width: "100%",
      }}
      className="table-scrollbar"
    >
      <Table withBorder verticalSpacing={"12px"}>
        <thead style={{ background: COLORS.PRIMARY }}>
          <tr>
            {heads.map((head, idx) => {
              return (
                <th
                  key={`accessor-of-${head.rowKey}`}
                  style={{
                    color: COLORS.WHITE,
                    width: head.width,
                    textAlign: "center",
                    border: BORDER_STYLE,
                    borderTop: NO_BORDER_STYLE,
                    borderLeft: idx == 0 ? NO_BORDER_STYLE : BORDER_STYLE,
                    borderRight: !!actions?.length
                      ? NO_BORDER_STYLE
                      : BORDER_STYLE,
                  }}
                >
                  {head.title}
                </th>
              );
            })}
            {!!actions?.length && (
              <th
                key={`accessor+action-column`}
                style={{
                  color: COLORS.WHITE,
                  textAlign: "center",
                  border: BORDER_STYLE,
                  borderTop: NO_BORDER_STYLE,
                  borderLeft: BORDER_STYLE,
                  borderRight: NO_BORDER_STYLE,
                }}
              >
                {t("Aksi")}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {isLoading ? loadingEl : !elements.length ? emptyData : rows}
        </tbody>
      </Table>
    </Stack>
  );
};
export default TableComponent;
