import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    return UserResponseDto.fromEntity(user);
  }

  async update(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    if (dto.username !== undefined) user.username = dto.username;
    if (dto.statusText !== undefined) user.statusText = dto.statusText;

    await this.userRepo.save(user);
    return UserResponseDto.fromEntity(user);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<UserResponseDto> {
    await this.userRepo.update({ id: userId }, { avatarUrl });
    return this.findById(userId);
  }

  async search(query: string): Promise<UserResponseDto[]> {
    if (!query || query.trim().length < 2) return [];

    const users = await this.userRepo.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
      take: 20,
    });

    return users.map(UserResponseDto.fromEntity);
  }
}