import { FormEvent, useState, useCallback } from "react";
//
import Link from "next/link";
import { useRouter } from "next/router";
//
import useSWR from "swr";
import { useAuthState } from "@context/auth";
import fetcher from "@controller/fetcher";
import formatDate from "@controller/formatDate";
//
import { Comment, Post, METHOD } from "@types";
//
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const PostPage = () => {
  const router = useRouter();

  const { sub, identifier, slug } = router.query;

  const { authenticated, user } = useAuthState();

  const [newComment, setNewComment] = useState("");

  // post
  const {
    data: post,
    // error: postError,
    mutate: postMutate,
    //
  } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);

  // comments
  const {
    data: comments,
    // error: commentError,
    mutate: commentMutate,
    //
  } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  //
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (newComment.trim() === "") return;

      try {
        await fetcher(
          METHOD.POST,
          `/posts/${post?.identifier}/${post?.slug}/comments`,
          {
            body: newComment,
          }
        );

        postMutate();
        commentMutate();

        setNewComment("");
      } catch (error) {
        console.log(error);
      }
    },
    [commentMutate, newComment, post?.identifier, post?.slug, postMutate]
  );
  //
  const vote = useCallback(
    async (value: number, comment?: Comment) => {
      if (!authenticated) router.push("/login");

      // 이미 클릭 한 vote 버튼을 눌렀을 시에는 reset
      // post vote
      if (!comment) post?.userVote === value && (value = 0);
      // comment vote
      if (comment) comment.userVote === value && (value = 0);

      try {
        await fetcher(METHOD.POST, "/votes", {
          // post vote
          identifier,
          slug,
          // comment vote
          commentIdentifier: comment?.identifier,
          //
          value,
        });

        postMutate();
        commentMutate();
      } catch (error) {
        console.log(error);
      }
    },
    [
      authenticated,
      commentMutate,
      identifier,
      post?.userVote,
      postMutate,
      router,
      slug,
    ]
  );

  return (
    <div className="flex px-4 pt-5 justify-center">
      <div className="w-full max-w-5xl md:w-8/12">
        <div className="bg-white rounded">
          {post && (
            <>
              <div className="flex">
                {/* 좋아요 싫어요 기능 부분 */}
                <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                  {/* 좋아요 */}
                  <div
                    className="flex justify-center items-center w-6 h-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => vote(1)}
                  >
                    {post.userVote === 1 ? (
                      <FaArrowUp className="text-red-500" />
                    ) : (
                      <FaArrowUp />
                    )}
                  </div>
                  <p className="text-xs font-bold">{post.voteScore}</p>
                  {/* 싫어요 */}
                  <div
                    className="flex justify-center items-center w-6 h-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                    onClick={() => vote(-1)}
                  >
                    {post.userVote === -1 ? (
                      <FaArrowDown className="text-blue-500" />
                    ) : (
                      <FaArrowDown />
                    )}
                  </div>
                </div>
                <div className="py-2 pr-2">
                  <div className="flex items-center">
                    <p className="text-xs test-gray-400">
                      Posted by <i className="fas fa-abacus" />
                      <Link href={`/u/${post.username}`}>
                        <span className="mx-1 hover:underline">
                          /u/{post.username}
                        </span>
                      </Link>
                      <Link href={post.url}>
                        <span className="mx-1 hover:underline">
                          {formatDate(post.createdAt, "YYYY-MM-DD HH:mm")}
                        </span>
                      </Link>
                    </p>
                  </div>
                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  <p className="my-3 text-sm">{post.body}</p>
                  <div className="flex">
                    <button>
                      <i className="mr-1 fas fa-comment-alt fa-xs" />{" "}
                      <span className="font-bold">
                        {post.commentCount} Comments
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 댓글 작성 구간 */}
              <div className="pr-6 mb-4 pl-9">
                {authenticated ? (
                  <div>
                    <p className="mb-1 text-xs">
                      <Link href={`/u/${user?.username}`}>
                        <span className="font-semibold text-blue-500">
                          {user?.username}
                        </span>
                      </Link>{" "}
                      으로 댓글 작성
                    </p>
                    <form onSubmit={handleSubmit}>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                      />
                      <div className="flex justify-end">
                        <button
                          className="px-3 py-1 text-white bg-gray-400 rounded"
                          disabled={newComment.trim() === ""}
                        >
                          댓글 작성
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                    <p className="font-semibold text-gray-400">
                      댓글 작성을 위해서 로그인 해주세요.
                    </p>
                    <div>
                      <Link href={`/login`}>
                        <span className="px-3 py-1 text-white bg-gray-400 rounded">
                          로그인
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {/* 댓글 리스트 부분 */}
              {comments?.map((comment) => (
                <div
                  className="flex bg-white rounded border-solid border border-slate-200"
                  key={comment.identifier}
                >
                  {/* 좋아요 싫어요 기능 부분 */}
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l  bg-gray-400">
                    {/* 좋아요 */}
                    <div
                      className="flex justify-center items-center w-6 h-6 mx-auto text-white rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1, comment)}
                    >
                      {comment.userVote === 1 ? (
                        <FaArrowUp className="text-red-500" />
                      ) : (
                        <FaArrowUp />
                      )}
                    </div>
                    <p className="text-xs font-bold">{comment.voteScore}</p>
                    {/* 싫어요 */}
                    <div
                      className="flex justify-center items-center w-6 h-6 mx-auto text-white rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                      onClick={() => vote(-1, comment)}
                    >
                      {comment.userVote === -1 ? (
                        <FaArrowDown className="text-red-500" />
                      ) : (
                        <FaArrowDown />
                      )}
                    </div>
                  </div>

                  <div className="py-2 pr-2">
                    <p className="mb-1 text-xs leading-none">
                      <Link href={`/u/${comment.username}`}>
                        <span className="mr-1 font-bold hover:underline">
                          {comment.username}
                        </span>
                      </Link>
                      <span className="text-gray-600">
                        {`
                          ${comment.voteScore}
                          posts
                          ${formatDate(comment.createdAt, "YYYY-MM-DD HH:mm")}
                        `}
                      </span>
                    </p>
                    <p>{comment.body}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
