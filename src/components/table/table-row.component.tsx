import { Button, Group } from "@mantine/core";
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

  return (
    <tr
      id="table-row"
      style={{
        background: rowIdx % 2 === 0 ? COLORS.backgroundGray : COLORS.WHITE,
      }}
    >
      {heads.map((head, headIdx) => {
        const value = element[head.rowKey];
        return (
          <TableTdComponent
            width={head.width}
            key={element.id + "td" + element.number}
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
              return (
                <Button
                  loading={
                    !!action.isLoading ? action.isLoading(element) : false
                  }
                  key={action.label}
                  style={{
                    background: action.buttonBackground,
                  }}
                  onClick={() => action.onClick(element)}
                >
                  {!!Icon && (
                    <Icon
                      fill={COLORS.WHITE}
                      style={{ marginRight: ".5rem" }}
                    />
                  )}
                  {t(action.label)}
                </Button>
              );
            })}
          </Group>
        </td>
      )}
    </tr>
  );
};
export default TableRowComponent;
