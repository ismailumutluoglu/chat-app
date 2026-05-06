import { Controller, Get, Query, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MessagesService } from './messages.service';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@UseGuards(AuthGuard('jwt-access'))
@Controller('rooms/:roomId/messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  getMessages(
    @Param('roomId') roomId: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.messagesService.getMessages(roomId, cursor);
  }

  @Delete(':messageId')
  deleteMessage(
    @Req() req: RequestWithUser,
    @Param('messageId') messageId: string,
  ) {
    return this.messagesService.softDelete(messageId, req.user.userId);
  }
}