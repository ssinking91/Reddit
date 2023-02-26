import React from "react";
//
import Image from "next/image";
//
import dayjs from "dayjs";
import formatDate from "../controller/formatDate";

interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

type Props = {
  user: User;
};

const UserSideBar = ({ user }: Props) => {
  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="flex items-center p-3 bg-gray-400 rounded-t">
        <Image
          src="https://www.gravatar.com/avatar/0000?d=mp&f=y"
          alt="user profile"
          className="mx-auto border border-white rounded-full"
          width={40}
          height={40}
        />
      </div>
      <div className="p-2 bg-white rounded-b">
        <p className="text-base">{user?.username}</p>
        <p>{formatDate(user?.createdAt, "YYYY.MM.DD")} 가입</p>
      </div>
    </div>
  );
};

export default UserSideBar;
