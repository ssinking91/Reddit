import React, { FormEvent, useCallback, useState } from "react";
//
import Link from "next/link";
import { useRouter } from "next/router";
//
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import registerSchema from "@util/schema/registerSchema";
//
import { METHOD } from "@types";
//
import { useAuthState } from "@context/auth";
import fetcher from "@controller/fetcher";
//
import InputGroup from "@components/InputGroup";

interface FormInputs {
  email: string;
  username: string;
  password: string;
}

const Register = () => {
  const router = useRouter();

  const { authenticated } = useAuthState();
  // router.replace는 스택 제일 위에 있는 원소를 새로운 url로 바꾸는 것
  if (authenticated) router.replace("/");

  const methods = useForm<FormInputs>({
    // onChange | onBlur | onSubmit | onTouched | all
    resolver: yupResolver(registerSchema),
    mode: "onChange", //실시간 유효성 검사
    defaultValues: {
      email: "test1@naver.com",
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
      //
      {
        // event.preventDefault();
        try {
          const res = await fetcher(METHOD.POST, "/auth/register", {
            email: data.email,
            username: data.username,
            password: data.password,
          });

          console.log("res", res);

          // router.replace는 스택 제일 위에 있는 원소를 새로운 url로 바꾸는 것
          router.replace("/login");
        } catch (error: any) {
          console.log("error", error);
          setResErrors(error.response?.data || {});
        }
      },
    [router]
  );

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium">회원가입</h1>
          <FormProvider {...methods}>
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <InputGroup
                placeholder="Email"
                error={resErrors.email || errors.email?.message}
                register={register("email")}
              />
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
                Sign up
              </button>
            </form>
          </FormProvider>
          <small>
            이미 가입하셨나요?
            <Link href="/login">
              <span className="ml-1 text-blue-500 uppercase">로그인</span>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
