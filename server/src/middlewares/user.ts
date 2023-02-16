import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

// 핸들러에서 유저 정보를 필요해 재사용성을 위해서 분리
// 먼저 Sub을 생성할 수 있는 유저인지 체크를 위해 유저 정보 가져오기(요청에서 보내주는 토큰을 이용)
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 요청의 쿠키에 담겨있는 토큰을 가져오기
    const token = req.cookies.token;
    console.log("token", token);

    if (!token) return next();

    // verify 메소드와 jwt secret을 이용해서 토큰 Decode
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰에서 나온 유저 이름을 이용해서 유저 정보 데이터베이스에서 가져오기
    const user = await User.findOneBy({ username });
    console.log("user", user);
    // 유저 정보가 없다면 throw error!
    if (!user) throw new Error("Unauthenticated");

    // res.locals 활용하여 전역에서 사용 가능한 변수 만들기
    // 유저 정보를 res.local.user에 넣어주기
    res.locals.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
};
