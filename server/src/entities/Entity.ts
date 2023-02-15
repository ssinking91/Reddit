import { instanceToPlain } from "class-transformer";
//
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  //
} from "typeorm";

// 모든 Entity에 id, createdAt, updatedAt 이 필요하다
// 그래서 BaseEntity를 따로 생성해서 다른 엔티티에서 상속받아 사용한다.
export default abstract class Entity extends BaseEntity {
  //@PrimaryGeneratedColumn()
  // - PrimaryGeneratedColumn () 데코레이터 클래스는 id 열이 Board 엔터티의 기본 키 열임을 나타내는 데 사용됩니다.
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // entities의 @Expose()를 프론트 데이터에 추가
  toJSON() {
    return instanceToPlain(this);
  }
}
