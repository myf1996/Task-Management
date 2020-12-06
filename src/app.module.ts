import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TaskModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from 'nest-queue';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkersModule } from './workers/workers.module';
import { EventWebsocketModule } from './event-websocket/event-websocket.module';


@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(),
    TaskModule,
    AuthModule,
    WorkersModule,
    EventWebsocketModule,

    
    
  ],
  controllers: [AppController],
  providers: [AppService,]

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('/');
  }
}
//{ path: 'cats', method: RequestMethod.GET }