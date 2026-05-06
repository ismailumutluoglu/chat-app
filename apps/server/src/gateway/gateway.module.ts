import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from './ws-jwt.guard';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
  ],
  providers: [ChatGateway, WsJwtGuard],
  exports: [ChatGateway],
})
export class GatewayModule {}