import React, { ReactNode } from "react";
import {
  BORDER_STYLE,
  NO_BORDER_STYLE,
  TColValue,
  TTextAlign,
} from "./table.component";

interface ITableTdProps {
  isFirstCol: boolean;
  isHaveAction: boolean;
  isLastRow: boolean;
  textAlign: TTextAlign;
  value: TColValue;
  width: number | string;
}

const TableTdComponent: React.FC<ITableTdProps> = ({
  isFirstCol,
  isHaveAction,
  isLastRow,
  textAlign,
  value,
  width,
}) => {
  return (
    <td
      style={{
        textAlign: textAlign,
        border: BORDER_STYLE,
        paddingTop: 0,
        paddingBottom: 0,
        borderLeft: isFirstCol ? NO_BORDER_STYLE : BORDER_STYLE,
        borderRight: isHaveAction ? NO_BORDER_STYLE : BORDER_STYLE,
        borderBottom: isLastRow ? NO_BORDER_STYLE : BORDER_STYLE,
        width: width,
        minWidth: width,
      }}
    >
      {typeof value === "object" ? value.element : value}
    </td>
  );
};
export default TableTdComponent;
