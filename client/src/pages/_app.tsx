import "@/src/styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true;

  return <Component {...pageProps} />;
}
