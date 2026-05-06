import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from './ws-jwt.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [ChatGateway, WsJwtGuard],
  exports: [ChatGateway],
})
export class GatewayModule {}