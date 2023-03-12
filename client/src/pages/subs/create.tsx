import { FormEvent, useState, useCallback } from "react";
//
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
//
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import subsCreateSchema from "@util/schema/subsCreateSchema";
//
import InputGroup from "@components/InputGroup";

interface FormInputs {
  name: string;
  title: string;
  description: string;
}

const SubCreate = () => {
  const router = useRouter();

  const methods = useForm<FormInputs>({
    resolver: yupResolver(subsCreateSchema),
    // onChange | onBlur | onSubmit | onTouched | all
    mode: "onChange", //실시간 유효성 검사
    defaultValues: {
      name: "test1",
      title: "test1",
      description: "test1",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [resErrors, setResErrors] = useState<any>({});

  const onSubmit = useCallback(
    async (data: FormInputs) =>
      // event: FormEvent
      //
      {
        //   event.preventDefault();
        try {
          const res = await axios.post("/subs", {
            name: data.name,
            title: data.title,
            description: data.description,
            //
          });

          console.log("res", res);

          router.push(`/r/${res.data.name}`);
        } catch (error: any) {
          console.log("error", error);
          setResErrors(error.response?.data || {});
        }
      },
    [router]
  );

  console.log(resErrors);
  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 p-4 mx-auto bg-white rounded md:w-96">
        <h1 className="mb-2 text-lg font-medium">커뮤니티 만들기</h1>
        <hr />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="mb-2 text-xs text-gray-400">
                커뮤니티 이름은 변경할 수 없습니다.
              </p>
              <InputGroup
                placeholder="이름"
                error={resErrors.name || errors.name?.message}
                register={register("name")}
              />
            </div>
            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="mb-2 text-xs text-gray-400">
                주제를 나타냅니다. 언제든지 변경할 수 있습니다.
              </p>
              <InputGroup
                placeholder="제목"
                error={resErrors.title || errors.title?.message}
                register={register("title")}
              />
            </div>
            <div className="my-6">
              <p className="font-medium">Description</p>
              <p className="mb-2 text-xs text-gray-400">
                해당 커뮤니티에 대한 설명입니다.
              </p>
              <InputGroup
                placeholder="설명"
                error={resErrors.description || errors.description?.message}
                register={register("description")}
              />
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded">
                커뮤니티 만들기
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SubCreate;

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
