import axios from "axios";
import React, { useEffect, useState } from "react";

export interface HeaderProps {
  idx: number;
  mundurtglbyr: number;
  headerlap1: string;
  headerlap2: string;
  alamat1: string;
  alamat2: string;
  footerkota: string;
  stricpayment: number;
  information: string;
  latitude: string;
  longitude: string;
}
const PDFHeader = (props: {
  dekstop?: HeaderProps;
  judul: string;
  description?: string;
}) => {
  return (
    <div className="mb-2">
      <div
        className="border-b w-full border-black"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px",
          paddingBottom: "15px",
        }}
      >
        <div style={{ marginRight: "10px" }}>
          <img
            src="/pudam-bayuangga.png"
            alt="Perumda Air Minum Bayuangga Logo"
            height={80}
            width={80}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            <p>{props.dekstop?.headerlap1}</p>
            <p>{props.dekstop?.headerlap2}</p>
          </div>
          <div
            style={{
              fontSize: "12px",
            }}
          >
            <p>{props.dekstop?.alamat1}</p>
            <p>{props.dekstop?.alamat2}</p>
          </div>
        </div>
      </div>

      <div className="flex ml-1 mt-2 items-start justify-center">
        {props.judul}
      </div>
      {props.description && (
        <div className="flex ml-1  items-start justify-center my-auto gap-4">
          {props.description}
        </div>
      )}
    </div>
  );
};

export default PDFHeader;
