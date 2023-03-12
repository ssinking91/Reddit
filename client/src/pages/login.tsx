import React, { FormEvent, useCallback, useState } from "react";
//
import Link from "next/link";
import { useRouter } from "next/router";
//
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginSchema from "@util/schema/loginSchema";
//
import { METHOD } from "@types";
//
import { useAuthDispatch, useAuthState } from "@context/auth";
import fetcher from "@controller/fetcher";
//
import InputGroup from "@components/InputGroup";
interface FormInputs {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const dispatch = useAuthDispatch();

  const { authenticated } = useAuthState();
  // router.replace는 스택 제일 위에 있는 원소를 새로운 url로 바꾸는 것
  if (authenticated) router.replace("/");

  const methods = useForm<FormInputs>({
    resolver: yupResolver(loginSchema),
    // onChange | onBlur | onSubmit | onTouched | all
    mode: "onChange", //실시간 유효성 검사
    defaultValues: {
      username: "test",
      password: "test11!!",
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
      {
        // event.preventDefault();
        try {
          const res = await fetcher(
            METHOD.POST,
            "/auth/login",
            {
              username: data.username,
              password: data.password,
              //
            },
            { withCredentials: true }
          );
          console.log(res);
          dispatch("LOGIN", res.data?.user);
          router.push("/");
        } catch (error: any) {
          console.log("error", error);
          setResErrors(error.response?.data || {});
        }
      },
    [dispatch, router]
  );

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium">로그인</h1>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputGroup
                placeholder="Username"
                error={resErrors.username || errors.username?.message}
                register={register("username")}
              />
              <InputGroup
                placeholder="Password"
                error={resErrors.password || errors.password?.message}
                register={register("password")}
              />
              <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
                로그인
              </button>
            </form>
          </FormProvider>
          <small>
            아직 아이디가 없나요?
            <Link href="/register">
              <span className="ml-1 text-blue-500 uppercase">회원가입</span>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
