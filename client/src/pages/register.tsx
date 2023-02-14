import React, { FormEvent, useState } from "react";
//
import Link from "next/link";
import { useRouter } from "next/router";
//
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuthState } from "../context/auth";
//
import InputGroup from "../components/InputGroup";

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

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: "onChange", //실시간 유효성 검사
    defaultValues: {
      email: "test1@naver.com",
      username: "test",
      password: "test11!!",
    },
  });

  const [resErrors, setResErrors] = useState<any>({});

  const watchFields = watch(["email", "username", "password"]);

  const onSubmit = async () =>
    // event: FormEvent
    //
    {
      // event.preventDefault();

      try {
        const res = await axios.post("/auth/register", {
          email: watchFields[0],
          username: watchFields[1],
          password: watchFields[2],
        });

        console.log("res", res);

        // router.replace는 스택 제일 위에 있는 원소를 새로운 url로 바꾸는 것
        router.replace("/login");
      } catch (error: any) {
        console.log("error", error);
        setResErrors(error.response?.data || {});
      }
    };
  console.log(resErrors);
  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium">회원가입</h1>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup
              placeholder="Email"
              error={resErrors.email || errors.email?.message}
              register={register("email", {
                // required: true,
                required: "email을 입력해 주세요.",
                pattern: {
                  value: /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/,
                  message: "올바른 이메일 형식이 아닙니다.",
                },
              })}
            />
            <InputGroup
              placeholder="Username"
              error={resErrors.username || errors.username?.message}
              register={register("username", {
                // required: true,
                required: "username을 입력해 주세요.",
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
            <InputGroup
              placeholder="Password"
              error={resErrors.password || errors.password?.message}
              register={register("password", {
                // required: true,
                required: "password를 입력해 주세요.",
                minLength: {
                  message: "8글자 이상 입력하세요.",
                  value: 8,
                },
                maxLength: {
                  message: "20글자 이하 입력하세요.",
                  value: 20,
                },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/,
                  message: "영문, 숫자, 특수문자를 혼합하여 입력해주세요.",
                },
              })}
            />
            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
              Sign up
            </button>
          </form>
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
