import * as yup from "yup";

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("올바른 이메일 형식 입력해 주세요.")
    .matches(
      /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/,
      "올바른 이메일 형식 입력해 주세요."
    )
    .required("이메일 입력해 주세요."),
  username: yup
    .string()
    .min(1, "1글자 이상 입력하세요.")
    .max(20, "20글자 이하 입력하세요.")
    .matches(/^[가-힣a-zA-Z]+$/, "한글, 영문만 입력 가능합니다.")
    .required("username을 입력해 주세요."),

  password: yup
    .string()
    .min(8, "8글자 이상 입력하세요.")
    .max(20, "20글자 이하 입력하세요.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/,
      "영문, 숫자, 특수문자를 혼합하여 입력해주세요."
    )
    .required("password를 입력해 주세요."),
});

export default registerSchema;
