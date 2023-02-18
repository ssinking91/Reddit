import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
//
import { FaSearch } from "react-icons/fa";
//
import { useAuthDispatch, useAuthState } from "../context/auth";
//
import fetcher from "../controller/fetcher";
import { METHOD } from "../types";

const NavBar: React.FC = () => {
  const router = useRouter();

  const dispatch = useAuthDispatch();
  const { loading, authenticated } = useAuthState();

  const handleLogout = async () => {
    try {
      const { success } = await fetcher(METHOD.POST, "/auth/logout");

      if (success) {
        dispatch("LOGOUT");
        // window.location.reload();
        router.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 bg-white h-13">
      <span className="text-2xl font-semibold text-gray-400">
        <Link href="/">
          <Image
            src="/reddit-name-logo.png"
            alt="logo"
            width={80}
            height={45}
          />
        </Link>
      </span>
      <div className="max-w-full px-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
          <FaSearch className="ml-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Reddit"
            className="px-3 py-1 bg-transparent rounded h-7 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="w-20 px-2 mr-2 text-sm text-center text-white bg-gray-400 rounded h-7"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link href="/login">
                <span className="w-20 px-2 py-1 mr-2 text-sm text-center text-blue-500 border border-blue-500 rounded h-7">
                  로그인
                </span>
              </Link>
              <Link href="/register">
                <span className="w-20 px-2 py-1 text-sm text-center text-white bg-gray-400 rounded h-7">
                  회원가입
                </span>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default NavBar;
