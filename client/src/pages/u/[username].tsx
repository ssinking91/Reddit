import React from "react";
//
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
//
import dayjs from "dayjs";
import useSWR from "swr";
//
import PostCard from "@/src/components/PostCard";
import { Comment, Post } from "../../types";

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username;

  const { data, error, mutate } = useSWR(
    username ? `/users/${username}` : null
  );
  console.log(data);

  if (!data) return null;

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* 유저 포스트 댓글 리스트 */}
      <div className="w-full md:mr-3 md:w-8/12">
        {data?.userData.map((data: any) => {
          if (data.type === "Post") {
            const post: Post = data;
            return (
              <PostCard key={post.identifier} post={post} mutate={mutate} />
            );
          } else {
            const comment: Comment = data;
            return (
              <div
                key={comment.identifier}
                className="flex my-4 bg-white rounded border-solid border border-slate-200"
              >
                <div className="flex-shrink-0 w-10 py-10 text-center bg-gray-400 border-r rounded-l">
                  <i className="text-white fas fa-comment-alt fa-xs" />
                </div>
                <div className="w-full p-2">
                  <p className="mb-2 text-xs text-gray-500">
                    <Link href={`/u/${comment.username}`}>
                      <span className="cursor-pointer hover:underline">
                        {comment.username}
                      </span>
                    </Link>{" "}
                    <span>commented on</span>{" "}
                    <Link href={`${comment.post?.url}`}>
                      <span className="font-semibold cursor-pointer hover:underline">
                        {comment.post?.title}
                      </span>
                    </Link>{" "}
                    <span>•</span>{" "}
                    <Link href={`/r/${comment.post?.subName}`}>
                      <span className="text-black cursor-pointer hover:underline">
                        /r/{comment.post?.subName}
                      </span>
                    </Link>
                  </p>
                  <hr />
                  <p className="p-1">{comment.body}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* 유저 정보 */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="flex items-center p-3 bg-gray-400 rounded-t">
          <Image
            src="https://www.gravatar.com/avatar/0000?d=mp&f=y"
            alt="user profile"
            className="mx-auto border border-white rounded-full"
            width={40}
            height={40}
          />
          <p className="pl-2 text-md">{data?.user.username}</p>
        </div>
        <div className="p-2 bg-white rounded-b">
          <p>{dayjs(data?.user.createdAt).format("YYYY.MM.DD")} 가입</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
