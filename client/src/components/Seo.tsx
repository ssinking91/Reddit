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
      "/subs/create": "SubsCreate",
      "/r/[sub]": "Sub",
      "/r/[sub]/[identifier]/[slug]": "Post",
      "/r/[sub]/create": "PostCreate",
    };
  }, []);

  const path = useCallback((name: string) => {
    return pathMap[name] || "where";
  }, []);

  console.log("pathname", router.pathname);

  return (
    <Head>
      <title>{`Reddit | ${path(router.pathname)}`}</title>
      <meta name="description" content="Reddit" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/reddit-logo.png" />
      <script
        defer
        src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"
        integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc"
        crossOrigin="anonymous"
      ></script>
    </Head>
  );
}
