import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  statusText?: string;
}