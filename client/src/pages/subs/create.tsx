import { FormEvent, useState } from "react";
//
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
//
import axios from "axios";
import { useForm } from "react-hook-form";
//
import InputGroup from "../../components/InputGroup";

interface FormInputs {
  name: string;
  title: string;
  description: string;
}

const SubCreate = () => {
  let router = useRouter();

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: "onChange", //실시간 유효성 검사
    defaultValues: {
      name: "test1",
      title: "test2",
      description: "",
    },
  });

  const [resErrors, setResErrors] = useState<any>({});

  const watchFields = watch(["name", "title", "description"]);

  const onSubmit = async () =>
    // event: FormEvent
    //
    {
      //   event.preventDefault();

      try {
        const res = await axios.post("/subs", {
          name: watchFields[0],
          title: watchFields[1],
          description: watchFields[2],
          //
        });

        // router.push(`/r/${res.data.name}`);
      } catch (error: any) {
        console.log(error);
        setResErrors(error.response.data);
      }
    };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 p-4 mx-auto bg-white rounded md:w-96">
        <h1 className="mb-2 text-lg font-medium">커뮤니티 만들기</h1>
        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-6">
            <p className="font-medium">Name</p>
            <p className="mb-2 text-xs text-gray-400">
              커뮤니티 이름은 변경할 수 없습니다.
            </p>
            <InputGroup
              placeholder="이름"
              error={resErrors.name || errors?.name?.message}
              register={register("name", {
                // required: true,
                required: "name을 입력해 주세요.",
                minLength: {
                  message: "1글자 이상 입력하세요.",
                  value: 1,
                },
                maxLength: {
                  message: "20글자 이하 입력하세요.",
                  value: 20,
                },
                pattern: {
                  value: /^[가-힣a-zA-Z]+$/,
                  message: "한글, 영문만 입력 가능합니다.",
                },
              })}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Title</p>
            <p className="mb-2 text-xs text-gray-400">
              주제를 나타냅니다. 언제든지 변경할 수 있습니다.
            </p>
            <InputGroup
              placeholder="제목"
              error={resErrors.title || errors?.title?.message}
              register={register("title", {
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
          </div>
          <div className="my-6">
            <p className="font-medium">Description</p>
            <p className="mb-2 text-xs text-gray-400">
              해당 커뮤니티에 대한 설명입니다.
            </p>
            <InputGroup
              placeholder="설명"
              error={resErrors.description || errors?.description?.message}
              register={register("description", {
                // required: true,
                required: "description을 입력해 주세요.",
              })}
            />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded">
              커뮤니티 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCreate;

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   try {
//     const cookie = req.headers.cookie;
//     // 쿠키가 없다면 에러를 보내기
//     if (!cookie) throw new Error("Missing auth token cookie");

//     // 쿠키가 있다면 그 쿠키를 이용해서 백엔드에서 인증 처리하기
//     await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
//       headers: { cookie },
//     });
//     return { props: {} };
//   } catch (error) {
//     // 백엔드에서 요청에서 던져준 쿠키를 이용해 인증 처리할 때 에러가 나면 /login 페이지로 이동
//     res.writeHead(307, { Location: "/login" }).end();

//     return { props: {} };
//   }
// };