import {
  Injectable, ForbiddenException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomParticipant } from './entities/room-participant.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
    @InjectRepository(RoomParticipant)
    private participantRepo: Repository<RoomParticipant>,
  ) {}

  async create(userId: string, dto: CreateRoomDto): Promise<Room> {
    if (dto.type === 'direct') {
      const targetId = dto.memberIds[0];
      const existing = await this.findExistingDm(userId, targetId);
      if (existing) return existing;
    }

    const room = this.roomRepo.create({
      type: dto.type,
      name: dto.name || null,
      createdBy: { id: userId },
    });
    await this.roomRepo.save(room);

    await this.participantRepo.save(
      this.participantRepo.create({ room, user: { id: userId }, role: 'owner' }),
    );

    for (const memberId of dto.memberIds) {
      if (memberId === userId) continue;
      await this.participantRepo.save(
        this.participantRepo.create({ room, user: { id: memberId }, role: 'member' }),
      );
    }

    return room;
  }

  async findMyRooms(userId: string, cursor?: string, limit = 20) {
  const query = this.participantRepo
    .createQueryBuilder('p')
    .innerJoinAndSelect('p.room', 'room')
    .where('p.user_id = :userId', { userId })
    .orderBy('room.updatedAt', 'DESC')
    .take(limit + 1);

  if (cursor) {
    query.andWhere('room.updatedAt < :cursor', { cursor: new Date(cursor) });
  }

  const items = await query.getMany();
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;

  return {
    data: data.map((p) => p.room),
    nextCursor: hasMore ? data[data.length - 1].room.updatedAt.toISOString() : null,
  };
}

  async findOne(roomId: string, userId: string) {
  const participant = await this.participantRepo.findOne({
    where: { room: { id: roomId }, user: { id: userId } },
  });
  if (!participant) throw new ForbiddenException('Bu odaya erişim izniniz yok');

  const room = await this.roomRepo.findOne({
    where: { id: roomId },
    relations: ['participants', 'participants.user'],
  });
  if (!room) throw new NotFoundException();

  // passwordHash'i temizle
  return {
    ...room,
    participants: room.participants.map((p) => ({
      ...p,
      user: {
        id: p.user.id,
        username: p.user.username,
        email: p.user.email,
        avatarUrl: p.user.avatarUrl,
        presence: p.user.presence,
      },
    })),
  };
}

  async addMember(roomId: string, requesterId: string, newMemberId: string) {
    const requester = await this.participantRepo.findOne({
      where: { room: { id: roomId }, user: { id: requesterId } },
    });
    if (!requester || requester.role === 'member') {
      throw new ForbiddenException('Sadece owner veya admin üye ekleyebilir');
    }

    const existing = await this.participantRepo.findOne({
      where: { room: { id: roomId }, user: { id: newMemberId } },
    });
    if (existing) return existing;

    return this.participantRepo.save(
      this.participantRepo.create({
        room: { id: roomId },
        user: { id: newMemberId },
        role: 'member',
      }),
    );
  }

  async removeMember(roomId: string, requesterId: string, targetId: string) {
    const requester = await this.participantRepo.findOne({
      where: { room: { id: roomId }, user: { id: requesterId } },
    });
    if (!requester || requester.role === 'member') {
      throw new ForbiddenException('Sadece owner veya admin üye çıkarabilir');
    }

    await this.participantRepo.delete({
      room: { id: roomId },
      user: { id: targetId },
    });
  }

  private async findExistingDm(userA: string, userB: string): Promise<Room | null> {
    return this.roomRepo
      .createQueryBuilder('r')
      .innerJoin('r.participants', 'p1', 'p1.user_id = :userA', { userA })
      .innerJoin('r.participants', 'p2', 'p2.user_id = :userB', { userB })
      .where('r.type = :type', { type: 'direct' })
      .getOne();
  }
}