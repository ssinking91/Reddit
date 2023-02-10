import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
//
import BaseEntity from "./Entity";
import User from "./User";
import Post from "./Post";

@Entity("subs")
export default class Sub extends BaseEntity {
  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : "https://www.gravatar.com/avatar?d=mp&f=y";
  }

  @Expose()
  get bannerUrl(): string {
    return this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined;
  }
}

// @Entity()
// - Entity () 데코레이터 클래스는 Sub 클래스가 엔티티임을 나타내는 데 사용됩니다.
// - CREATE TABLE subs 부분입니다.

// @Column()
// - Column () 데코레이터 클래스는 Sub 엔터티의 name / title / description / imageUrn / bannerUrn / username 과 같은 다른 열을 나타내는 데 사용됩니다.

// @Index()
// - 데이터베이스 인덱스를 생성합니다. 엔터티 속성 또는 엔터티에 사용할 수 있습니다.
// - 엔티티에 사용될 때 복합 열로 인덱스를 생성할 수 있습니다.

// @JoinColumn()
// - @JoinColumn을 통해서 어떤 관계쪽이 외래 키(Foreign Key)를 가지고 있는지 나타냅니다.
// - @JoinColumn을 설정하면 데이터베이스에 propertyName + referencedColumnName이라는 열이 자동으로 생성됩니다.
// - 이 데코레이터는 @ManyToOne의 경우 선택 사항이지만 @OneToOne의 경우 필수입니다.

// @Expose()
// - getter 또는 method에 설정하여 getter 또는 method가 반환하는 것을 표시할 수 있습니다.
