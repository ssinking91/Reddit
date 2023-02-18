import type { AppProps } from "next/app";
import { useRouter } from "next/router";
//
import Axios from "axios";
import { SWRConfig } from "swr";
//
import { AuthProvider } from "../context/auth";
import fetcher from "../controller/fetcher";
import { METHOD } from "../types";
//
import NavBar from "../components/NavBar";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
//
import "@/src/styles/globals.css";
//
export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true;

  const { pathname } = useRouter();
  const authRouteSet = ["/register", "/login"];
  const isAuthRoute = authRouteSet.includes(pathname);

  return (
    <SWRConfig value={{ fetcher: (url) => fetcher(METHOD.GET, url) }}>
      <Seo />
      <AuthProvider>
        <Layout isAuthRoute={isAuthRoute}>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </SWRConfig>
  );
}
