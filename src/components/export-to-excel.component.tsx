import React from "react";
import * as ExcelJS from "exceljs";
import { Button } from "@mantine/core";

interface ExportToExcelButtonProps {
  data: any[]; // Replace 'any' with the type of your data objects
  filename?: string;
  sheetname?: string;
  heading?: Record<string, string>;
}

const defaultColumnWidth = 35; // Default column width in rem
const defaultFontSize = 9; // Default font size

const ExportToExcelButton: React.FC<ExportToExcelButtonProps> = ({
  data,
  filename,
  sheetname,
  heading,
}) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname || "Sheet1");

    // Set default column width
    worksheet.columns =
      data.length > 0
        ? Object.keys(data[0]).map((key: string) => {
            let cw = defaultColumnWidth;
            if (key === "No") cw = 4;
            if (key === "TPS") cw = 8;
            if (key === "Kelurahan" || key === "Kecamatan") cw = 15;
            if (key === "NIK" || key === "NKK") cw = 18;
            return {
              header: key,
              width: cw,
            };
          })
        : [];

    // Set default font size for the entire worksheet
    worksheet.eachRow((row, rowNumber) => {
      row.font = { size: defaultFontSize + 3, bold: true };

      // Set border for each cell in the row
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Set smaller font size for the header row
    if (heading) {
      worksheet.insertRow(1, []);
      const headerRow = worksheet.insertRow(1, Object.values(heading));
      const targetRow = worksheet.insertRow(
        1,
        Object.values([" ", process.env.NEXT_PUBLIC_TARGET])
      );
      headerRow.font = { size: 16, bold: true }; // Adjust the font size as needed
      targetRow.font = { size: 14, bold: true }; // Adjust the font size as needed
    }

    // Add data to the worksheet
    data.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      // Set border for each cell in the row
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Save the workbook as a file
    await workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.xlsx` || "exported-data.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Button color="blue" onClick={exportToExcel}>
      Export to Excel
    </Button>
  );
};

export default ExportToExcelButton;
