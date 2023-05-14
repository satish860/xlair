"use client";

import Image from "next/image";
import { ChangeEvent } from "react";
import DataGrid, { textEditor, Column } from "react-data-grid";
import { read, utils, WorkSheet } from "xlsx";

type DataSet = { [index: string]: WorkSheet };
type Row = any[];
type AOAColumn = Column<Row>;
type RowCol = { rows: Row[]; columns: AOAColumn[] };

const getRowsCols = (data: DataSet, sheetName: string): RowCol => ({
  rows: utils.sheet_to_json<Row>(data[sheetName], { header: 1 }),
  columns: Array.from(
    {
      length: utils.decode_range(data[sheetName]["!ref"] || "A1").e.c + 1,
    },
    (_, i) => ({
      key: String(i),
      name: utils.encode_col(i),
      editor: textEditor,
    })
  ),
});

export default function Upload() {
  async function handleAB(file: ArrayBuffer): Promise<void> {
    /* read file data */
    const data = read(file);
    const sheetName = data.SheetNames[0];
    const worksheet = data.Sheets[sheetName];

    /* update workbook state */
    const new_rows = utils.sheet_to_json<Row>(worksheet, { header: 1 });
    console.log(new_rows[0]);
  }

  async function handleFile(ev: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = await ev.target.files?.[0]?.arrayBuffer();
    if (file) await handleAB(file);
  }
  return (
    <>
      <h3>Xlair</h3>
      <input type="file" onChange={handleFile} />
    </>
  );
}
