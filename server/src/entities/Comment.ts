import { Exclude, Expose } from "class-transformer";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
//
import BaseEntity from "./Entity";
import User from "./User";
import Post from "./Post";
import Vote from "./Vote";
//
import { makeId } from "../utils/helpers";

@Entity("comments")
export default class Comment extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @Column()
  postId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @Expose() get voteScore(): number {
    const initialValue = 0;
    return this.votes?.reduce(
      (previousValue, currentObject) =>
        previousValue + (currentObject.value || 0),
      initialValue
    );
  }

  @BeforeInsert()
  makeId() {
    this.identifier = makeId(8);
  }
}

// @Entity()
// - Entity () 데코레이터 클래스는 Comment 클래스가 엔티티임을 나타내는 데 사용됩니다.
// - CREATE TABLE comments 부분입니다.

// @Column()
// - Column () 데코레이터 클래스는 Comment 엔터티의 identifier / body / username / postId /  과 같은 다른 열을 나타내는 데 사용됩니다.

// @Index()
// - 데이터베이스 인덱스를 생성합니다. 엔터티 속성 또는 엔터티에 사용할 수 있습니다.
// - 엔티티에 사용될 때 복합 열로 인덱스를 생성할 수 있습니다.

// @JoinColumn()
// - @JoinColumn을 통해서 어떤 관계쪽이 외래 키(Foreign Key)를 가지고 있는지 나타냅니다.
// - @JoinColumn을 설정하면 데이터베이스에 propertyName + referencedColumnName이라는 열이 자동으로 생성됩니다.
// - 이 데코레이터는 @ManyToOne의 경우 선택 사항이지만 @OneToOne의 경우 필수입니다.
