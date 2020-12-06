import { Injectable } from '@nestjs/common';


@Injectable()
export class TaskMicroService {
  getMicroService(data): string {
    console.log('MicroService Service File',data)
    return 'Hello World!';
  }
}

