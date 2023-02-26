import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
//
import Image from "next/image";
import { useRouter } from "next/router";
//
import useSWR from "swr";
//
import { METHOD, Sub, Post } from "@types";
//
import fetcher from "@controller/fetcher";
import { useAuthState } from "@context/auth";
//
//
import SubSideBar from "@components/SubSideBar";
import PostCard from "@components/PostCard";
import Spinner from "@components/Spinner";

const SubPage = () => {
  const { authenticated, user } = useAuthState();

  const router = useRouter();
  const subName = router.query.sub;

  const [ownSub, setOwnSub] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //
  const {
    data: sub,
    // error,
    isLoading,
    mutate: subMutate,
  } = useSWR(subName ? `/subs/${subName}` : null);

  //
  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [authenticated, sub, user]);

  // console.log("sub", sub);

  //
  const uploadImage = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      // console.log(event);
      if (event.target.files === null) return;

      const file = event.target.files[0];
      console.log("file", file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileInputRef.current!.name);

      try {
        const res = await fetcher(
          METHOD.POST,
          `/subs/${sub.name}/upload`,
          formData,
          {
            headers: { "Context-Type": "multipart/form-data" },
          }
        );

        console.log(res);

        if (res) {
          subMutate({
            ...sub,
            imageUrl: res.imageUrl,
            bannerUrl: res.bannerUrl,
          });
          // subMutate();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [sub, subMutate]
  );

  //
  const openFileInput = useCallback(
    (type: string) => {
      // 이미지 변경 권한 설정 : 본인인지 확인
      if (!ownSub) return;

      const fileInput = fileInputRef.current;
      if (fileInput) {
        // banner, image
        fileInput.name = type;
        fileInput.click();
      }
    },
    [ownSub]
  );

  //
  const renderPosts = useCallback(
    (sub: Sub, isLoading: boolean) => {
      let renderPosts;

      if (isLoading) {
        renderPosts = (
          <div className="w-full flex items-center justify-center">
            <Spinner />
          </div>
        );
      } else if (sub.posts.length === 0) {
        renderPosts = (
          <p className="text-lg text-center">아직 작성된 포스트가 없습니다.</p>
        );
      } else {
        renderPosts = sub.posts.map((post: Post) => (
          <PostCard key={post.identifier} post={post} subMutate={subMutate} />
        ));
      }

      return renderPosts;
    },
    [subMutate]
  );

  return (
    <>
      {sub && (
        <>
          <div>
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            />
            {/* 배너 이미지 */}
            <div className="bg-gray-400">
              {sub.bannerUrl ? (
                <div
                  className="h-56 cursor-pointer"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => openFileInput("banner")}
                />
              ) : (
                <div
                  className="h-20 bg-gray-400 cursor-pointer"
                  onClick={() => openFileInput("banner")}
                />
              )}
            </div>
            {/* 커뮤니티 메타 데이터 */}
            <div className="h-20 bg-white">
              <div className="relative flex max-w-5xl px-5 mx-auto">
                <div
                  className="absolute"
                  style={{ top: -15, width: "70px", height: "70px" }}
                >
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      alt="커뮤니티 이미지"
                      //   width={70}
                      //   height={70}
                      className="rounded-full cursor-pointer"
                      fill={true}
                      onClick={() => openFileInput("image")}
                      draggable="false"
                    />
                  )}
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold ">{sub.title}</h1>
                  </div>
                  <p className="font-bold text-gray-400 text-small">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 포스트와 사이드바 */}
          <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            <div className="w-full md:mr-3 md:w-8/12">
              {renderPosts(sub, isLoading)}{" "}
            </div>
            <SubSideBar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
