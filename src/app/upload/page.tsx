"use client";

import Image from "next/image";
import { ChangeEvent } from "react";
import DataGrid, { textEditor, Column } from "react-data-grid";
import { read, utils, WorkSheet } from "xlsx";

type DataSet = { [index: string]: WorkSheet };
type Row = any[];
type AOAColumn = Column<Row>;
type RowCol = { rows: Row[]; columns: AOAColumn[] };
type PropertyTypes = { [key: string]: Set<string> };

const getPropertyTypes = (jsonArray: any[]): PropertyTypes => {
    const propertyTypes: PropertyTypes = {};
  
    jsonArray.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (typeof value !== 'undefined') {
          propertyTypes[key] = propertyTypes[key] || new Set();
          propertyTypes[key].add(typeof value);
        }
      });
    });
  
    return propertyTypes;
  };
  



export default function Upload() {
  async function handleAB(file: ArrayBuffer): Promise<void> {
    /* read file data */
    const data = read(file);
    const sheetName = data.SheetNames[0];
    const worksheet = data.Sheets[sheetName];

    /* update workbook state */
    const new_rows = utils.sheet_to_json<Row>(worksheet, { header: 1 });
    console.log(new_rows[0]);
    const propertyTypes = getPropertyTypes(new_rows.slice(1));
    console.log(propertyTypes);
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
