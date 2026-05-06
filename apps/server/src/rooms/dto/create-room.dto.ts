import {
  IsEnum, IsString, IsUUID,
  MaxLength, ValidateIf, IsArray,
} from 'class-validator';

export class CreateRoomDto {
  @IsEnum(['direct', 'group'])
  type: 'direct' | 'group';

  @ValidateIf((o) => o.type === 'group')
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  memberIds: string[];
}