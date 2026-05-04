export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  statusText: string;
  presence: string;
  lastSeenAt: Date | null;
  createdAt: Date;

  static fromEntity(user: any): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.email = user.email;
    dto.avatarUrl = user.avatarUrl;
    dto.statusText = user.statusText;
    dto.presence = user.presence;
    dto.lastSeenAt = user.lastSeenAt;
    dto.createdAt = user.createdAt;
    return dto;
  }
}