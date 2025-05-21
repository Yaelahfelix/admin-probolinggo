// import { fetchRegionNames } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
'use client'
import { useCallback, useState } from "react";
import { Combobox } from "@/components/combobox";
import useFetch from "@/hooks/useFetch";
import { Skeleton } from "./ui/skeleton";

export default function PelangganCombobox({
  defaultValue,
  onValueChange,
  defaultLabel,
}: {
  defaultValue?: string;
  defaultLabel?: string;
  onValueChange: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState(defaultLabel);
  const [search, setSearch] = useState(defaultValue);
	const [ pengaduanFilter, setPengaduanFilter ] = useState({ limit:  10 , search : search });
	const { data: UserData, isLoading: UserLoading, isError: UserError, mutate: UserMutate } = useFetch('/api/pelanggan-search', pengaduanFilter)
	// if ( UserLoading) return (
	// 	null
	// )
	const handleSearch = (value : string) => {
		setSearch(value)
		// console.log(value,'from combopelanggan');
		setPengaduanFilter({...pengaduanFilter, search : value})
	}
	

  // const { data } = useQuery({
  //   queryKey: ["regions", search],
  //   queryFn: () =>
  //     fetchRegionNames(search).then((res) =>
  //       res.map((region) => ({
  //         value: region.id.toString(),
  //         label: region.name,
  //       })),
  //     ),
  // });

  return (
    <Combobox
      className="w-full"
      items={UserData || []}
      value={value}
      label={label}
      onSelect={(value, label) => {
        setValue(value || "");
        setLabel(label || "");
        onValueChange(value);
      }}
      onSearchChange={handleSearch}
      searchPlaceholder="Search pelanggan or nama or alamat..."
      noResultsMsg="No pelanggan found"
      selectItemMsg="Select a Pelanggan"
    />
  );
}