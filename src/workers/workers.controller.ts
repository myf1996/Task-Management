import { Controller, Post, Body } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from 'src/tasks/tasks.repository';

@Controller('workers')
export class WorkersController {
    constructor(
    
    @InjectQueue('audio') 
    private readonly audioQueue: Queue,
    
    @InjectRepository(TaskRepository)
    private taskRepository:TaskRepository,
    ) {}

    @Post('transcode')
    transcode(@Body('value') value:string) {
        
      this.audioQueue.add('transcode', { value },{ delay: 8000 });
      const qs = this.taskRepository.createQueryBuilder('task');
      return qs.getMany()
    }
}
