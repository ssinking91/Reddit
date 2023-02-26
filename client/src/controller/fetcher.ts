import axios from "axios";
import { METHOD } from "@types";

const fetcher = async (
  method: METHOD,
  url: string,
  ...rest: { [key: string]: any }[]
) => {
  const res = await axios[method](url, ...rest);
  return res.data;
};

export default fetcher;
