import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageDocument } from './schemas/message.schema';
import { RoomParticipant } from '../rooms/entities/room-participant.entity';

interface SendMessageDto {
  roomId: string;
  senderId: string;
  type?: string;
  content: string;
  replyTo?: string;
}

interface MessageQuery {
  room_id: string;
  is_deleted: boolean;
  created_at?: { $lt: Date };
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,

    @InjectRepository(RoomParticipant)
    private participantRepo: Repository<RoomParticipant>,
  ) {}

  async send(dto: SendMessageDto): Promise<MessageDocument> {
    const participant = await this.participantRepo.findOne({
      where: { room: { id: dto.roomId }, user: { id: dto.senderId } },
    });
    if (!participant) {
      throw new ForbiddenException('Bu odada mesaj gönderme izniniz yok');
    }

    const message = await this.messageModel.create({
      room_id: dto.roomId,
      sender_id: dto.senderId,
      type: dto.type || 'text',
      content: dto.content,
      reply_to: dto.replyTo || null,
    });

    return message;
  }

  async getMessages(roomId: string, cursor?: string, limit = 30) {
    const query: MessageQuery = { room_id: roomId, is_deleted: false };

    if (cursor) {
      query.created_at = { $lt: new Date(cursor) };
    }

    const messages = await this.messageModel
      .find(query)
      .sort({ created_at: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = messages.length > limit;
    const data = hasMore ? messages.slice(0, limit) : messages;

    return {
      data: data.reverse(),
      nextCursor: hasMore ? (data[0] as any).created_at : null,
    };
  }

  async softDelete(messageId: string, userId: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) return;
    if (message.sender_id !== userId) {
      throw new ForbiddenException('Sadece kendi mesajınızı silebilirsiniz');
    }

    await this.messageModel.updateOne(
      { _id: messageId },
      { is_deleted: true, content: '', media_urls: [] },
    );
  }
}