import React, { FormEvent, useCallback } from "react";
//
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
//
import { useForm } from "react-hook-form";
import axios from "axios";
//
import fetcher from "@controller/fetcher";
//
import { METHOD } from "@types";

interface FormInputs {
  title: string;
  content: string;
}

const PostCreate = () => {
  const router = useRouter();
  // pathname : "/r/[sub]/create"
  // query:{sub: subName}
  const { sub: subName } = router.query;

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: "onChange", //실시간 유효성 검사
    defaultValues: {
      title: "titleTEST1",
      content: "contentTEST1",
    },
  });

  const watchFields = watch(["title", "content"]);

  const onSubmit = useCallback(async () =>
    // event: FormEvent
    //
    {
      // event.preventDefault();

      if (watchFields[0].trim() === "" || !subName) return;

      try {
        const post = await fetcher(METHOD.POST, "/posts", {
          title: watchFields[0].trim(),
          body: watchFields[1],
          sub: subName,
        });

        console.log("post", post);

        router.push(`/r/${subName}/${post.identifier}/${post.slug}`);
      } catch (error) {
        console.log(error);
      }
    }, [router, subName, watchFields]);

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">포스트 생성하기</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="제목"
                maxLength={20}
                {...register("title", {
                  // required: true,
                  required: "title을 입력해 주세요.",
                  minLength: {
                    message: "1글자 이상 입력하세요.",
                    value: 1,
                  },
                  maxLength: {
                    message: "20글자 이하 입력하세요.",
                    value: 20,
                  },
                })}
              />
              <div
                style={{ top: 10, right: 10 }}
                className="absolute mb-2 text-sm text-gray-400 select-none"
              >
                {watchFields[0].trim().length}/20
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="설명"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              {...register("content", {
                // required: true,
                required: "content을 입력해 주세요.",
                minLength: {
                  message: "1글자 이상 입력하세요.",
                  value: 1,
                },
              })}
            />
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded">
                생성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;

// 인증에 따른 제한
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키가 없다면 에러를 보내기
    if (!cookie) throw new Error("Missing auth token cookie");

    // 쿠키가 있다면 그 쿠키를 이용해서 백엔드에서 인증 처리하기
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });

    return { props: {} };
  } catch (error) {
    // 백엔드에서 요청에서 던져준 쿠키를 이용해 인증 처리할 때 에러가 나면 /login 페이지로 이동
    res.writeHead(307, { Location: "/login" }).end();

    return { props: {} };
  }
};

// * res.writeHead(상태코드, 헤더 정보)
// - 응답 헤더에 대한 정보를 기록하는 메서드입니다. 상태 코드는 HTTP 상태코드를 말하는데 200, 404, 500 등 이다. 'text/html' 은 응답의 콘텐츠 형식이 HTML 이라는 의미이고, 'utf-8' 은 한글 표시를 하라는 의미이다.
// - writeHead는 http응답 메시지 헤더를 작성한다는 뜻이고, 307는 브라우저한테 페이지를 이동시켜라고 명령하는 것
// - Location: '/'는 어디로 이동할지를 적어주는 것

// * res.write()
// - 본문(body)에 보여지는 부분을 쓰는 메서드이다.

// * res.end()
// - 응답을 종료하는 메서드이다.
