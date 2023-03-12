import * as yup from "yup";

const subsCreateSchema = yup.object().shape({
  name: yup
    .string()
    .min(1, "1글자 이상 입력하세요.")
    .max(20, "20글자 이하 입력하세요.")
    .required("name을 입력해 주세요."),
  title: yup
    .string()
    .min(1, "1글자 이상 입력하세요.")
    .max(20, "20글자 이하 입력하세요.")
    .required("title을 입력해 주세요."),

  description: yup.string().required("description을 입력해 주세요."),
});

export default subsCreateSchema;
