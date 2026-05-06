import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Message {
  @Prop({ required: true })
  room_id: string;

  @Prop({ required: true })
  sender_id: string;

  @Prop({ enum: ['text', 'image', 'file', 'audio'], default: 'text' })
  type: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Message', default: null })
  reply_to: Types.ObjectId | null;

  @Prop({ type: [String], default: [] })
  media_urls: string[];

  @Prop({ default: false })
  is_deleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ content: 'text' });
MessageSchema.index({ room_id: 1, created_at: -1 });