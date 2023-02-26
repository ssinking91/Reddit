import { useCallback, useEffect, useState } from "react";
//
import type { NextPage } from "next";
//
import useSWRInfinite from "swr/infinite";
//
import { Post } from "../types";
//
import PostCard from "../components/PostCard";
import MainSideBar from "../components/MainSideBar";
import Spinner from "../components/Spinner";
//
const Home: NextPage = () => {
  // 각 페이지의 SWR 키를 얻기 위한 함수,
  // `fetcher`에 의해 허용된 값을 반환합니다.
  // `null`이 반환된다면, 페이지의 요청은 시작되지 않습니다.
  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null; // 끝에 도달
    return `/posts?page=${pageIndex}`; // SWR 키
  };

  const {
    data, //  [Array(8), Array(3)]
    error,
    // isValidating,
    mutate,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<Post[]>(getKey);

  const isInitialLoading = !data && !error;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : []; // [{…}, {…}, ...]

  // 다음 페이지 포스트들을 가져오기 위한 포스트 id state
  const [observedPost, setObservedPost] = useState("");

  const observeElement = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;
      // 브라우저 뷰포트(ViewPort)와 설정한 요소(Element)의 교차점을 관찰
      const io = new IntersectionObserver(
        // entries는 IntersectionObserverEntry 인스턴스의 배열
        (entries) => {
          // isIntersecting: 관찰 대상의 교차 상태(Boolean)
          if (entries[0].isIntersecting === true) {
            console.log("마지막 포스트에 왔습니다.");
            setPage(page + 1);
            io.unobserve(element);
          }
        },
        // 옵저버가 실행되기 위해 타겟의 가시성이 얼마나 필요한지 백분율로 표시
        { threshold: 0.4 }
      );
      // 대상 요소의 관찰을 시작
      io.observe(element);
    },
    [page, setPage]
  );

  // Infinite Scroll 기능 구현
  useEffect(() => {
    // 포스트가 없다면 return
    if (!posts || posts.length === 0) return;

    // posts 배열안에 마지막 post에 id를 가져옵니다.
    const id = posts[posts.length - 1].identifier;
    // posts 배열에 post가 추가돼서 마지막 post가 바뀌었다면
    // 바뀐 post 중 마지막post를 obsevedPost로
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [observeElement, observedPost, posts]);

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* 포스트 리스트 */}
      <div className="w-full md:mr-3 md:w-8/12">
        {isInitialLoading && (
          <div className="w-full flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {posts?.map((post) => (
          <PostCard key={post.identifier} post={post} mutate={mutate} />
        ))}
        {/* 사이드바 */}
      </div>

      <MainSideBar />
    </div>
  );
};

export default Home;
