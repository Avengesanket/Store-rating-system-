import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  email: string; 

  @Column('decimal', { 
    precision: 3, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value) => value,
      from: (value) => parseFloat(value)
    }
  })
  avgRating: number;

  @OneToOne(() => User)
  @JoinColumn() 
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}