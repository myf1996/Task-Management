import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TaskMicroService } from './tasks.microservices.service';

@Controller()
export class TaskMicroServicesController {
  constructor(private readonly taskMicroService: TaskMicroService) {}

  @MessagePattern({ cmd: 'microservices/all-task/' })
  getMicroService(data): string {
    console.log("aja bhai")
    console.log('microservice controller file')
    return this.taskMicroService.getMicroService(data);
  }
}