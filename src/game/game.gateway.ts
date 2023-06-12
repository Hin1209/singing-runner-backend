import { UserMatchDto } from './../user/dto/user.match.dto';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
/**
 * webSocket 통신을 담당하는 Handler
 */
@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private gameService: GameService) {}

  afterInit(server: Server) {
    console.log('Socket.io server initialized in ');
  }

  handleConnection(@ConnectedSocket() user: Socket) {
    console.log(`Client connected: ${user.id}`);
  }

  handleDisconnect(@ConnectedSocket() user: Socket) {
    console.log(`Client disconnected: ${user.id}`);
  }

  /**
   * MatchMakingPolicy에 따라 user가 매칭되면 GameRoom에 추가 후
   * 같이 매칭된 user들(same GameRoom) 과 함께 songTilte, Singer 정보를 전송
   */
  @SubscribeMessage('match_making')
  matchMakingData(
    @ConnectedSocket() user: Socket,
    @MessageBody() userMatchDto: UserMatchDto,
  ) {
    console.log('matchmaking connect');
    this.gameService.matchMaking(user, userMatchDto);
  }

  /**
   * 같은 Room user가 전부 accpet시 게임시작
   * 한명이라도 거절시 Room 제거, 수락한 user는 readyQueue 에 우선순위가 높게 push
   */
  @SubscribeMessage('accept')
  matchAcceptData(
    @ConnectedSocket() user: Socket,
    @MessageBody() accept: boolean,
  ) {
    this.gameService.matchAccept(user, accept);
  }
}