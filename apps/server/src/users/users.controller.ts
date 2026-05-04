import {
  Controller, Get, Patch, Body, Param, Query,
  UseGuards, Req, Post, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@UseGuards(AuthGuard('jwt-access'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  updateMe(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, dto);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.usersService.search(query);
  }

  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
          return cb(new Error('Sadece JPEG, PNG ve WebP kabul edilir'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadAvatar(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    const url = `/uploads/avatars/${file.filename}`;
    return this.usersService.updateAvatar(req.user.userId, url);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}