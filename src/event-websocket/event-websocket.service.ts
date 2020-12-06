import { Injectable, OnModuleInit, OnModuleDestroy, NotFoundException } from '@nestjs/common';
import { EventWebsocketGateway } from './event-websocket.gateway';
//import { RedisClient,createClient } from '@nestjs/microservices/external/redis.interface';
import { createClient, RedisClient } from 'redis';
import { catchClause } from '@babel/types';

@Injectable()
export class EventWebsocketService implements OnModuleInit, OnModuleDestroy{
    
    private serviceId: string;
    public redisClient: RedisClient;
    public publisherClient: RedisClient;
    private subscriberClient: RedisClient;
    private discoveryInterval;

    
    constructor(
        private readonly socketGateway: EventWebsocketGateway
        ) 
    {
    this.serviceId = 'SOCKET_CHANNEL_' + Math.random().toString(26).slice(2);

    // setInterval(() => {
    //     this.sendMessage(
    //       'user1',
    //       new Date().toLocaleTimeString() +
    //         ` | from server on port ${process.env['PORT']}`,
    //       false,
    //     );
    //   }, 3000);

    }
    async onModuleInit() {
        this.redisClient = await this.newRedisClient();
        this.subscriberClient = await this.newRedisClient();
        this.publisherClient = await this.newRedisClient();

        this.subscriberClient.subscribe(this.serviceId);

        this.subscriberClient.on('message', (channel, message) => {
            const { userId, payload } = JSON.parse(message);
            this.sendMessage(userId, payload, true);
        });

        await this.channelDiscovery();
        
    }
    
    private async newRedisClient() {
        return createClient({
            host: 'localhost',
            port: 6379,
        });
    }

    private async channelDiscovery() {
        this.redisClient.setex(this.serviceId, 3, Date.now().toString());
        this.discoveryInterval = setTimeout(() => {
            this.channelDiscovery();
          }, 2000);
    }

    async onModuleDestroy() {
        this.discoveryInterval && clearTimeout(this.discoveryInterval);
    }

    async sendMessage(
        userId: string,
        payload: string,
        fromRedisChannel: boolean,
    ) {
        try {
            this.socketGateway.connectedSockets[userId]?.forEach(socket =>
                socket.send(payload),
            );

            if (!fromRedisChannel) {
                this.redisClient.keys('SOCKET_CHANNEL_', (err, ids) => {
                    ids.filter(p => p != this.serviceId).forEach(id => {
                        this.publisherClient.publish(
                            id,
                            JSON.stringify({
                                payload,
                                userId,
                            }),
                        );
                    });
                });
            }
        }   
        catch (error) {
            console.log(error)
            throw new NotFoundException('User Object Not Found in event-websocket service line#65')
        }
    }
}
