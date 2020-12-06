import { Module } from '@nestjs/common';
import { EventWebsocketGateway } from 'src/event-websocket/event-websocket.gateway';
import { TasksController, CommentsController } from './tasks.controller';
import { TaskService, CommentsService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TaskMicroServicesController } from '../microservices/tasks/tasks.microservies.controller';
import { TaskMicroService } from '../microservices/tasks/tasks.microservices.service';
import { Comment } from './tasks.entity';
import { ScheduleModule } from '@nestjs/schedule';
// import { BullModule } from '@nestjs/bull';
// import { EventWebsocketModule } from 'src/event-websocket/event-websocket.module';


@Module({
  imports:
    [ 
      //EventWebsocketModule,
      TypeOrmModule.forFeature( [TaskRepository,Comment]),
      AuthModule,
      ScheduleModule.forRoot(),
      
      //BullModule,

      // BullModule.registerQueue({
      //   name: 'tasks',
      //   redis: {
      //     host: 'localhost',
      //     port: 6379,
      //   },
      
      // }),
    ],
  
  controllers: [TasksController,CommentsController,TaskMicroServicesController],
  providers: [TaskService,CommentsService,TaskMicroService,EventWebsocketGateway]
})
export class TaskModule {}
