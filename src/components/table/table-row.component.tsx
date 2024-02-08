import { Button, Group, Stack } from "@mantine/core";
import { useTranslation } from "next-i18next";
import React from "react";
import {
  BORDER_STYLE,
  IFETableRowColumnProps,
  NO_BORDER_STYLE,
  THead,
  TableAction,
} from "./table.component";
import TableTdComponent from "./table-td.component";
import { COLORS } from "@/constants/colors.contant";
import { getUUID } from "@/utils/function.util";
import Link from "next/link";

interface ITableRowComponentProps {
  isLast: boolean;
  actions?: TableAction[];
  heads: THead[];
  rowIdx: number;
  element: IFETableRowColumnProps;
}

const TableRowComponent: React.FC<ITableRowComponentProps> = ({
  isLast,
  actions,
  heads,
  rowIdx,
  element,
}) => {
  const { t } = useTranslation();

  const valDup = {};

  return (
    <tr
      id="table-row"
      style={{
        background: rowIdx % 2 === 0 ? COLORS.backgroundGray : COLORS.WHITE,
      }}
    >
      {heads.map((head, headIdx) => {
        const value = element[head.rowKey];
        let key = value + "" + getUUID();
        return (
          <TableTdComponent
            width={head.width}
            key={key}
            isFirstCol={headIdx === 0}
            isHaveAction={!!actions?.length}
            isLastRow={isLast}
            textAlign={head.rowTextAlign}
            value={value}
          />
        );
      })}

      {/* Action column exist if there action */}
      {!!actions?.length && (
        <td
          style={{
            border: BORDER_STYLE,
            borderLeft: BORDER_STYLE,
            borderRight: NO_BORDER_STYLE,
            width: "1rem",
            borderBottom: isLast ? NO_BORDER_STYLE : BORDER_STYLE,
          }}
        >
          <Group style={{ justifyContent: "center" }} noWrap>
            {actions.map((action) => {
              const Icon = action.icon;

              const Wrapper: any = action.isLink ? Link : Stack;

              console.log("Wrapper: ", Wrapper);
              return (
                <Wrapper
                  key={action.label}
                  href={action.href && action.href(element)}
                >
                  <Button
                    loading={
                      !!action.isLoading ? action.isLoading(element) : false
                    }
                    style={{
                      background: action.buttonBackground,
                    }}
                    onClick={() => action.onClick && action.onClick(element)}
                  >
                    {!!Icon && (
                      <Icon
                        fill={COLORS.WHITE}
                        style={{ marginRight: ".5rem" }}
                      />
                    )}
                    <span>{t(action.label)}</span>
                  </Button>
                </Wrapper>
              );
            })}
          </Group>
        </td>
      )}
    </tr>
  );
};
export default TableRowComponent;
