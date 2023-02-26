import Image from "next/image";
import Link from "next/link";
//
import useSWR from "swr";
//
import { useAuthState } from "@context/auth";
//
import { Sub } from "@types";
//
const MainSideBar = () => {
  const { authenticated } = useAuthState();

  const address = `/subs/sub/topSubs`;

  const { data: topSubs } = useSWR<Sub[]>(address);
  // console.log(topSubs);

  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="bg-white border rounded">
        <div className="p-4 border-b">
          <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
        </div>
        {/* 커뮤니티 리스트 */}
        <div>
          {topSubs?.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center px-4 py-2 text-xs border-b"
            >
              <Link href={`/r/${sub.name}`}>
                <Image
                  src={sub.imageUrl}
                  className="rounded-full cursor-pointer h-6"
                  alt="Sub"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href={`/r/${sub.name}`}>
                <span className="ml-2 font-bold hover:cursor-pointer">
                  /r/{sub.name}
                </span>
              </Link>
              <p className="ml-auto font-md">{sub.postCount}</p>
            </div>
          ))}
        </div>
        {authenticated && (
          <div className="w-full py-6 text-center">
            <Link href="/subs/create">
              <span className="w-full p-2 text-center text-white bg-gray-400 rounded">
                커뮤니티 만들기
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainSideBar;
