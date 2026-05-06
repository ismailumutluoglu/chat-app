import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@UseGuards(AuthGuard('jwt-access'))
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(req.user.userId, dto);
  }

  @Get()
  findMyRooms(@Req() req: RequestWithUser, @Query('cursor') cursor?: string) {
    return this.roomsService.findMyRooms(req.user.userId, cursor);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.roomsService.findOne(id, req.user.userId);
  }

  @Post(':id/members')
  addMember(
    @Req() req: RequestWithUser,
    @Param('id') roomId: string,
    @Body('userId') newMemberId: string,
  ) {
    return this.roomsService.addMember(roomId, req.user.userId, newMemberId);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Req() req: RequestWithUser,
    @Param('id') roomId: string,
    @Param('userId') targetId: string,
  ) {
    return this.roomsService.removeMember(roomId, req.user.userId, targetId);
  }
}