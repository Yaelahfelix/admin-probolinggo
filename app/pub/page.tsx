'use client'
import { useEffect, useState } from 'react';
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';

export default function Pub() {
  const [listPrinter,setListPrinter] = useState()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const browserPrint =  new ZebraBrowserPrintWrapper();
        const listOfPrint =  await browserPrint.getAvailablePrinters();
        setListPrinter(listOfPrint);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
    
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			{listPrinter}
    </div>
  )
}
