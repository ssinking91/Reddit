import * as yup from "yup";

const subCreateSchema = yup.object().shape({
  title: yup
    .string()
    .min(1, "1글자 이상 입력하세요.")
    .max(20, "20글자 이하 입력하세요.")
    .required("title을 입력해 주세요."),
  content: yup
    .string()
    .min(1, "1글자 이상 입력하세요.")
    .required("content를 입력해 주세요."),
});

export default subCreateSchema;
