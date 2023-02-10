import bcrypt from "bcryptjs";
import { IsEmail, Length } from "class-validator";
import {
  Entity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  //
} from "typeorm";
//
import BaseEntity from "./Entity";
import Post from "./Post";
import Vote from "./Vote";

@Entity("users")
export default class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: "이메일 주소가 잘못되었습니다." })
  @Length(1, 255, { message: "이메일 주소는 비워둘 수 없습니다." })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 32, { message: "사용자 이름은 3자 이상이어야 합니다." })
  @Column({ unique: true })
  username: string;

  @Column()
  @Length(6, 255, { message: "비밀번호는 6자리 이상이어야 합니다." })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}

// @Entity()
// - Entity () 데코레이터 클래스는 User 클래스가 엔티티임을 나타내는 데 사용됩니다.
// - CREATE TABLE users 부분입니다.

// @Column()
// - Column () 데코레이터 클래스는 User 엔터티의 email / username과 같은 다른 열을 나타내는 데 사용됩니다.

// @Index()
// - 데이터베이스 인덱스를 생성합니다. 엔터티 속성 또는 엔터티에 사용할 수 있습니다.
// - 엔티티에 사용될 때 복합 열로 인덱스를 생성할 수 있습니다.

// @JoinColumn()
// - @JoinColumn을 통해서 어떤 관계쪽이 외래 키(Foreign Key)를 가지고 있는지 나타냅니다.
// - @JoinColumn을 설정하면 데이터베이스에 propertyName + referencedColumnName이라는 열이 자동으로 생성됩니다.
// - 이 데코레이터는 @ManyToOne의 경우 선택 사항이지만 @OneToOne의 경우 필수입니다.
