import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WorkersController } from './workers.controller';
import { AudioProcessor } from './workers.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from 'src/tasks/tasks.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature( [TaskRepository]),
    BullModule.registerQueue({
      name: 'audio',
    })
  ],
  controllers: [WorkersController],
  providers: [AudioProcessor],
})
export class WorkersModule {}
