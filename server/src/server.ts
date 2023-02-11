import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";

import authRoutes from "./routes/auth";
import subRoutes from "./routes/subs";
import postRoutes from "./routes/posts";
import voteRoutes from "./routes/votes";
import userRoutes from "./routes/users";

import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// * morgan : nodeJS 에서 사용되는 로그 관리를 위한 미들웨어 입니다.
// * nodemon : 서버 코드를 변경 할 때마다 서버를 재시작하 일을 자동으로 대신 해줍니다.
// * ts-node : Node.js 상에서 TypeScript Compiler를 통하지 않고도, 직접 TypeScript를 실행시키는 역할을 합니다.
// * @types/express @types/node : Express 및 NodeJS에 대한 Type 정의에 도움이 됩니다.

const app = express();
// const origin = process.env.ORIGIN;
const origin = "http://localhost:3000";
app.use(
  cors({
    origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
dotenv.config();

// app.get의 url로 접속을 하면 해당 블록의 코드를 실행합니다.
app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/users", userRoutes);

app.use(express.static("public"));

let port = 4000;

// app.listen의 포트로 접속하면 해당 블록의 코드를 실행합니다.
app.listen(port, async () => {
  console.log(`server running at ${process.env.APP_URL}`);

  AppDataSource.initialize()
    .then(() => {
      console.log("database initialized");
    })
    .catch((error) => console.log(error));
});
