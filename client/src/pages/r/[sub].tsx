import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
//
import Image from "next/image";
import { useRouter } from "next/router";
//
import useSWR from "swr";
import fetcher from "@/src/controller/fetcher";
import SideBar from "@/src/components/SideBar";
import { useAuthState } from "@/src/context/auth";
//
import { METHOD, Post } from "@/src/types";
//
import PostCard from "@/src/components/PostCard";

const SubPage = () => {
  const { authenticated, user } = useAuthState();

  const router = useRouter();
  const subName = router.query.sub;

  const [ownSub, setOwnSub] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: sub,
    error,
    mutate,
  } = useSWR(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  console.log("sub", sub);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event);
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
        mutate({ ...sub, imageUrl: res.imageUrl, bannerUrl: res.bannerUrl });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    // 이미지 변경 권한 설정 : 본인인지 확인
    if (!ownSub) return;

    const fileInput = fileInputRef.current;
    if (fileInput) {
      // banner, image
      fileInput.name = type;
      fileInput.click();
    }
  };

  let renderPosts;

  if (!sub) {
    renderPosts = <p className="text-lg text-center">로딩중...</p>;
  } else if (sub.posts.length === 0) {
    renderPosts = (
      <p className="text-lg text-center">아직 작성된 포스트가 없습니다.</p>
    );
  } else {
    renderPosts = sub.posts.map((post: Post) => (
      <PostCard key={post.identifier} post={post} subMutate={mutate} />
    ));
  }

  console.log("sub.imageUrl", sub?.imageUrl);
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
                    backgroundImage: `url(${bannerUrl || sub.bannerUrl})`,
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
                      src={imageUrl || sub.imageUrl}
                      alt="커뮤니티 이미지"
                      //   width={70}
                      //   height={70}
                      fill={true}
                      className="rounded-full cursor-pointer"
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
            <div className="w-full md:mr-3 md:w-8/12">{renderPosts} </div>
            <SideBar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
