
type Props = {
  datattd : DataTtd,
  tanggalreport : string,
  kota : string,
}


export type DataTtd = {
  header1 : string,
  header2 : string,
  header3 : string,
  header4  : string,
  nama1 : string,
  jab1 : string,
  nik1 : string,
  nama2 : string,
  jab2 : string,
  nik2 : string,
  nama3 : string,
  jab3 : string,
  nik3 : string,
  nama4 : string,
  jab4 : string,
  nik4 : string,
  nama5 : string,
  jab5 : string,
  nik5 : string,
}

const FooterLapSpk = (props: Props) => {
  return (
    <div className='inline-block mt-2 mb-2 w-full'>
      <div className="grid grid-cols-3 gap-3">
         {/* ttdkiri */}
        <div className=' text-center text-xs' >
          <p className=' h-5'></p>
          <p >
            {props.datattd.header1}
          </p>
          <p >
            {props.datattd.jab1}
          </p>
          <p className=' h-[65px]'></p>
          <p >
            {props.datattd.nama1}
          </p>
          <p >
            {props.datattd.nik1}
          </p>
        </div>
        {/* ttdtengah */}
        <div className=' text-center text-xs' >
          {/* <p className=' h-5'></p>
          <p >
            {props.datattd.header2}
          </p>
          <p >
            {props.datattd.jab2}
          </p>
          <p className=' h-[65px]'></p>
          <p >
            {props.datattd.nama2}
          </p>
          <p >
            {props.datattd.nik2}
          </p> */}
        </div>
        {/* ttdkanan */}
        <div className=' text-center text-xs' >
          <p className=' h-5'>Probolinggo, {props.tanggalreport} </p>
          <p >
            {props.datattd.header3}
          </p>
          <p >
            {props.datattd.jab3}
          </p>
          <p className=' h-[65px]'></p>
          <p >
            {props.datattd.nama3}
          </p>
          <p >
            {props.datattd.nik3}
          </p>
        </div>

                {/* ttdkanan */}
        <div className=' text-center text-xs' >
          {/* <p className=' h-5'>Probolinggo, {props.tanggalreport} </p>
          <p >
            {props.datattd.header4}
          </p>
          <p >
            {props.datattd.jab4}
          </p>
          <p className=' h-[65px]'></p>
          <p >
            {props.datattd.nama4}
          </p>
          <p >
            {props.datattd.nik4}
          </p> */}
        </div>

        {/* <div className=' text-center text-xs' >
          <p className=' h-5'>Menyetujui : </p>
          <p className=' h-5'>PERUMDA AIR MINUM BAYUANGGA</p>
          <p className=' h-5'>KOTA PROBOLINGGO</p>
          <p >
            {props.datattd.jab2}
          </p>
          <p className=' h-[65px]'></p>
          <p >
            {props.datattd.nama2}
          </p>
          <p >
            {props.datattd.nik2}
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default FooterLapSpk