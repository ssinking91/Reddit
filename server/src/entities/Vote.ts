import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Comment from "./Comment";
import BaseEntity from "./Entity";
import Post from "./Post";
import { User } from "./User";

@Entity("votes")
export default class Vote extends BaseEntity {
  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  username: string;

  @Column({ nullable: true })
  postId: number;

  @ManyToOne(() => Post)
  post: Post;

  @Column({ nullable: true })
  commentId: number;

  @ManyToOne(() => Comment)
  comment: Comment;
}

// @Entity()
// - Entity () 데코레이터 클래스는 Vote 클래스가 엔티티임을 나타내는 데 사용됩니다.
// - CREATE TABLE votes 부분입니다.

// @Column()
// - Column () 데코레이터 클래스는 Vote 엔터티의 value / username / postId / commentId 같은 다른 열을 나타내는 데 사용됩니다.

// @Index()
// - 데이터베이스 인덱스를 생성합니다. 엔터티 속성 또는 엔터티에 사용할 수 있습니다.
// - 엔티티에 사용될 때 복합 열로 인덱스를 생성할 수 있습니다.

// @JoinColumn()
// - @JoinColumn을 통해서 어떤 관계쪽이 외래 키(Foreign Key)를 가지고 있는지 나타냅니다.
// - @JoinColumn을 설정하면 데이터베이스에 propertyName + referencedColumnName이라는 열이 자동으로 생성됩니다.
// - 이 데코레이터는 @ManyToOne의 경우 선택 사항이지만 @OneToOne의 경우 필수입니다.
