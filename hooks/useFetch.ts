import useSWR from 'swr';
import axios from "axios";

const backendUrl = process.env.BASE_URL;


const instance = axios.create({
  baseURL : backendUrl,
});


const fetcher  = (url : any) => instance.get(url).then(res => res.data)


export default function useFetch(url : any, params : any = {}) {
  // if values in params is null, undefined, or empty string, remove it
  const filteredParams = Object.keys(params).reduce((acc : any, key : any) => {
    if (
      params[key] !== null &&
      params[key] !== undefined &&
      params[key] !== '' &&
      params[key] !== 'undefined' &&
      params[key] !== 'null'
    ) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
  const string_params = new URLSearchParams(filteredParams).toString();
  const req_url = string_params ? `${url}?${string_params}` : url;
  const { data, error, isLoading, mutate } = useSWR(req_url, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}