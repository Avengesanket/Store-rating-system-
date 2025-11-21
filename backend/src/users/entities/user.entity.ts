import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../user-roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; 

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL_USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}