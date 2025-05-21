import Image from "next/image";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import logo from "@/public/nlogo.svg";
import { Button } from "@/components/ui/button";
import { RekapAduan } from "@/types/rekap-aduan";

// Props type definition
type DRDTableProps = {
  data: RekapAduan[];
  jenis?: string;
  tanggal?: string;
  isLoading: boolean;
};

// Component to be printed
const ReportPrintComponent = React.forwardRef<HTMLDivElement, DRDTableProps>(
  ({ data = [], tanggal, jenis }, ref) => {
    return (
      <div
        ref={ref}
        className="print-container"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="header w-full">
          <div className="w-full ">
            {/* <div
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
                  src="/logo/pudam-bayuangga.png"
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
                  <p>{headerlap1}</p>
                  <p>{headerlap2}</p>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                  }}
                >
                  <p>{alamat1}</p>
                  <p>{alamat2}</p>
                </div>
              </div>
            </div> */}
            <div className="inline-block my-2 w-full border-b border-black pb-4">
              <div className="flex ml-1 items-start justify-start my-auto gap-4">
                <div className="flex items-start">
                  {/* <Image
            src={logos[0].src}
            alt="logo"
            width={50}
            height={logos[0].height}
            className='bg-none'
          /> */}
                  <img src={logo.src} width={75} alt="logo"></img>

                  {/* <Image
            src={myLogo}
            alt="logo"
            width={75}
            height={logos[0].height}
            className='bg-none'
          /> */}
                  <div className={`my-0 ml-1 p-0 `}>
                    <p
                      className={`text-sm tracking-wider uppercase text-teal-800 font-bold`}
                    >
                      Perumda air minum Tirta Dhaha
                    </p>
                    <p
                      className={`text-sm tracking-wider uppercase text-teal-800 font-bold`}
                    >
                      Kota Kediri
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-1.5">
              <h1 className="text-lg text-center uppercase">
                Rekapitulasi Aduan
              </h1>
              <h3 className="text-base text-center capitalize">{tanggal}</h3>
            </div>
          </div>
        </div>
        <div className="footer"></div>

        {/* Table container */}
        <table className="w-full">
          <thead>
            <tr>
              <td>
                <div className="header-space">&nbsp;</div>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <div>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    {/* Table Header */}
                    <thead
                      style={{
                        display: "table-header-group",
                      }}
                    >
                      <tr style={{ backgroundColor: "#f0f0f0" }}>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "20%",
                          }}
                        >
                          {jenis}
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "10%",
                          }}
                        >
                          Belum Selesai
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "10%",
                          }}
                        >
                          Sudah Selesai
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "15%",
                          }}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.nama || "-"}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.belum_selesai} Aduan
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.sudah_selesai} Aduan
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            {item.jml} Aduan
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ttd */}
                {/* <div className="signature mt-5">
                  <div
                    className="flex justify-between items-end gap-5"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div className={!signatureData?.is_id_1 ? "invisible" : ""}>
                      <Signature
                        position={signatureData?.jabatan1}
                        name={signatureData?.nama1}
                        description={signatureData?.header1}
                      />
                    </div>
                    <div className={!signatureData?.is_id_2 ? "invisible" : ""}>
                      <Signature
                        position={signatureData?.jabatan2}
                        name={signatureData?.nama2}
                        description={signatureData?.header2}
                      />
                    </div>
                    <div
                      className={clsx(
                        "flex flex-col items-center gap-5",
                        !signatureData?.is_id_3 ? "invisible" : ""
                      )}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: "12px",
                        }}
                      >
                        {footer},{" "}
                        {format(new Date(), "d MMMM yyyy", { locale: id })}
                      </div>
                      <Signature
                        position={signatureData?.jabatan3}
                        name={signatureData?.nama3}
                        description={signatureData?.header3}
                      />
                    </div>
                  </div>
                  <div
                    className={clsx(
                      "flex justify-center mt-7",
                      !signatureData?.is_id_4 ? "hidden" : ""
                    )}
                  >
                    <Signature
                      position={signatureData?.jabatan4}
                      name={signatureData?.nama4}
                      description={signatureData?.header4}
                    />
                  </div>
                </div> */}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                <div className="page-footer-space"></div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
);

ReportPrintComponent.displayName = "ReportPrintComponent";

const PDFReport: React.FC<DRDTableProps> = (props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      console.log("Print completed");
    },
    pageStyle: `
    @media print {
      @page { 
        size: A4; margin: 30px;
        @bottom-right {
          font-size: 12px;
          content: counter(page) " / " counter(pages);
        }
      }
   
      body { 
        -webkit-print-color-adjust: exact; 
        counter-reset: page;
      }

      thead {
        display: table-header-group !important;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      thead tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }
            
      .header, .header-space {
        height: 150px;
      }
      
      .footer, .footer-space {
        height: 100px;
      }
      
      .header {
        position: fixed;
        top: 0;
      }
      
      .footer {
        position: fixed;
        bottom: 0;
      }
      
      table {
        page-break-inside: avoid;
      }
                    
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      .signature {
        page-break-before: auto;
        position: relative;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      .page-number::after {
        counter-increment: page;
        content: "Halaman " counter(page);
        position: fixed;
        bottom: 10px;
        right: 20px;
        font-size: 12px;
      }
    }
    `,
  });

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={handlePrint as any}
          // startContent={<Printer />}
          disabled={props.isLoading}
        >
          Cetak
        </Button>
      </div>
      <div ref={componentRef} className="border-t mt-5">
        <ReportPrintComponent {...props} />
      </div>

      <style jsx>{`
        .hidden-print {
          display: none;
        }

        @media print {
          .hidden-print {
            display: block;
          }

          body * {
            visibility: hidden;
          }

          .hidden-print,
          .hidden-print * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default PDFReport;
