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
import Sub from "./Sub";
import Comment from "./Comment";
import Vote from "./Vote";
//
import { makeId, slugify } from "../utils/helpers";

@Entity("posts")
export default class Post extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
  }

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}

// @Entity()
// - Entity () 데코레이터 클래스는 Post 클래스가 엔티티임을 나타내는 데 사용됩니다.
// - CREATE TABLE posts 부분입니다.

// @Column()
// - Column () 데코레이터 클래스는 Post 엔터티의 identifier / title / slug / body / subName / username / 과 같은 다른 열을 나타내는 데 사용됩니다.

// @Index()
// - 데이터베이스 인덱스를 생성합니다. 엔터티 속성 또는 엔터티에 사용할 수 있습니다.
// - 엔티티에 사용될 때 복합 열로 인덱스를 생성할 수 있습니다.

// @JoinColumn()
// - @JoinColumn을 통해서 어떤 관계쪽이 외래 키(Foreign Key)를 가지고 있는지 나타냅니다.
// - @JoinColumn을 설정하면 데이터베이스에 propertyName + referencedColumnName이라는 열이 자동으로 생성됩니다.
// - 이 데코레이터는 @ManyToOne의 경우 선택 사항이지만 @OneToOne의 경우 필수입니다.

// @Expose()
// - getter 또는 method에 설정하여 getter 또는 method가 반환하는 것을 표시할 수 있습니다.

// @Exclude()
// - 변환 중에 일부 속성을 건너뛰고 싶을 때 사용한다.
