import dayjs from "dayjs";

const formatDate = (date: string, format: string) => {
  const res = dayjs(date).format(format);
  return res;
};

export default formatDate;
