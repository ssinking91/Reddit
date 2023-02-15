import { useCallback, useMemo } from "react";
//
import { useRouter } from "next/router";
import Head from "next/head";
//

interface pathMap {
  [key: string]: string;
}

export default function Seo() {
  const router = useRouter();

  const pathMap: pathMap = useMemo(() => {
    return {
      "/": "Home",
      "/login": "Login",
      "/register": "Register",
      "/subs/create": "Create",
    };
  }, []);

  const path = useCallback((name: string) => {
    return pathMap[name] || "where";
  }, []);

  return (
    <Head>
      <title>Reddit | {path(router.pathname)}</title>
      <meta name="description" content="Reddit" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/reddit-logo.png" />
    </Head>
  );
}
