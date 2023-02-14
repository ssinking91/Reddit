import type { AppProps } from "next/app";
import { useRouter } from "next/router";
//
import Axios from "axios";
//
import { AuthProvider } from "../context/auth";
//
import NavBar from "../components/NavBar";
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
    <AuthProvider>
      {!isAuthRoute && <NavBar />}
      <div className={isAuthRoute ? "" : "pt-12"}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
