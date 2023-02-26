import { ReactNode } from "react";
//
import NavBar from "./NavBar";
//
interface Layout {
  children: ReactNode;
  isAuthRoute: boolean;
}

export default function Layout({ children, isAuthRoute }: Layout) {
  return (
    <>
      {!isAuthRoute && <NavBar />}
      <div className={isAuthRoute ? "" : "pt-12 bg-gray-200 min-h-screen"}>
        {children}
      </div>
    </>
  );
}
