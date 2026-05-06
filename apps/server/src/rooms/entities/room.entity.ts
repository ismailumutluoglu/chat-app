import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoomParticipant } from './room-participant.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['direct', 'group'] })
  type: 'direct' | 'group';

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => RoomParticipant, (p) => p.room)
  participants: RoomParticipant[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}