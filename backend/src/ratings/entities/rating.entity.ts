import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('ratings')
// Constraint: A user can only rate a specific store once.
@Unique(['user', 'store']) 
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  value: number; // 1 to 5

  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // If user is deleted, remove their ratings
  user: User;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' }) // If store is deleted, remove ratings
  store: Store;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}