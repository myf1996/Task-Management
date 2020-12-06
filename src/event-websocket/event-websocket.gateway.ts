import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Socket } from 'engine.io';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';

@WebSocketGateway(3001)//80, { transports: ['websocket'] }
export class EventWebsocketGateway implements OnGatewayInit, OnGatewayConnection , OnGatewayDisconnect {
    

    @WebSocketServer()
    server: Server;

    public connectedSockets: { [key: string]: any[] } = {};


    private logger : Logger = new Logger('EventWebsocketService')
    afterInit(server: Server) {
        this.logger.log('================================')
        this.logger.log('EventWebsocketService Initialize')
        this.logger.log('================================')
    }
    
    handleConnection(client: any,req: Request, ...args: any[]) { 
        client.emit("connection","Connection Successfully Created")
        this.logger.log('================================')
        this.logger.log('HANDLING CONNECTIONS')
        this.logger.log('================================')
        
    }


    handleDisconnect(client: any) {
        this.logger.log('================================')
        this.logger.log('HANDLING DISCONENT')
        this.logger.log('================================')

        // this.connectedSockets[client.userId] = this.connectedSockets[
        //     client.userId
        //   ].filter(p => p.id !== client.id);
        
    }
    

    // @SubscribeMessage('events')
    // onEvent(client: any, data: any): Observable<WsResponse<number>> {
    //     return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    // }

    @SubscribeMessage('events')
    handleEvent(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
        ): string {

        client.emit('events', { name: 'Nest' });

        return data;
    }

}
