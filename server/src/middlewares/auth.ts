import { NextFunction, Request, Response } from "express";
import User from "../entities/User";

// 유저 정보나 유저의 등급에 따라서 인증을 따로해 재사용성을 위해서 분리
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;

    if (!user) throw new Error("Unauthenticated");

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};
