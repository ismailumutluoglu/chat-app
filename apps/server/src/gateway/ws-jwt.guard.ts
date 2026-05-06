import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      client.disconnect();
      throw new WsException('Token bulunamadı');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('jwt.accessSecret'),
      });
      client.data.userId = payload.sub;
      client.data.email = payload.email;
      return true;
    } catch {
      client.disconnect();
      throw new WsException('Geçersiz token');
    }
  }
}