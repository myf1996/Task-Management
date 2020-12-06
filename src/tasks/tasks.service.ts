import { Injectable, NotFoundException } from '@nestjs/common';
// import { TaskStatus } from './interface/task.interface';

import { TaskRepository } from './tasks.repository';
import { Tasks,Comment } from './tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskFilterDto } from './dto/task-filter.dto';
import { User } from 'src/auth/auth.entity';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Cron, Interval } from '@nestjs/schedule';
import { CommentDto } from './dto/comment-.dto';
import { Connection, getConnection } from 'typeorm';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue, } from 'bull';
// import { QueueInjection } from 'nest-queue';
// import { userInfo } from 'os';
// import Bull = require('bull');
// import { Task } from 'nestjs-bull';
import { EventWebsocketGateway } from '../event-websocket/event-websocket.gateway';

// smtp settings

var mailer = require("nodemailer");

var smtpTransport = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "temptesting135@gmail.com",
        pass: "p@ssw0rd786"
    }
});


@Injectable()
export class TaskService  { 
    private client: ClientProxy;

    constructor(
        
    
        @InjectRepository(TaskRepository)
        private taskRepository:TaskRepository,

        private event_gateway : EventWebsocketGateway,
    ){
        this.client = ClientProxyFactory.create({
                transport : Transport.REDIS,
                options : {
                    url: 'redis://localhost:6379',
                },
              })

    }
    
    async getAllTasks(taskfilter:TaskFilterDto,user): Promise<Tasks[]> {
        this.event_gateway.server.emit('newIdea', user)
        
        // var mail = {
        //     from: "temptesting135@gmail.com",
        //     to: "yassarfarooq13@gmail.com",
        //     subject: "Send Email Using Node.js",

        //     // attachments: [
        //     //     {
        //     //         filename: '../../email_sending_file.txt',
        //     //         path:  __dirname,
        //     //     }
        //     // ],
        //     html: "<b>Node.js <h1>New world</h1> for me</b>"
        // }
        
        // smtpTransport.sendMail(mail, function(error, response){
        //     if(error){
        //         console.log(error);
        //     }else{
        //         console.log("Message sent: " + response);
        //     }
        
        //     smtpTransport.close();
        // });
        return this.taskRepository.getAllTasks(taskfilter,user)
    }

    async createTask(CreateTaskdto,user): Promise<Tasks> {
        return await this.taskRepository.createTask(CreateTaskdto,user)
    }
    
    async getTaskbyId(id:number,user): Promise<Tasks> {
        return await this.taskRepository.getTaskbyId(id,user)
    }

    async updateTaskbyId(id: number,CreateTaskdto,user): Promise<Tasks> {
        return await this.taskRepository.updateTaskbyId(id,CreateTaskdto,user)
    }

    async deleteTaskbyId(id:number,user:User): Promise<void> {
        return await this.taskRepository.deleteTaskbyId(id,user)
    }

    async updateTaskStatus(id:number,user:User): Promise<Tasks> {
        return this.taskRepository.updateTaskStatus(id,user)
    }

    //@Interval(10000)
    getMicroService(user:User): Observable<string>{
        console.log("here")
        return this.client.send<string>({ cmd: 'microservices/all-task/' },'user')
    }

    async addCommentonTask(id:number,user:User,commentDto:CommentDto): Promise<Comment> {
        return this.taskRepository.addCommentonTask(id,user,commentDto)
    }

    async getAllCommentbyTaskId(id:number,user:User): Promise<Comment[]>{
        const comment = await getConnection().createQueryBuilder()
                        .select('comment').from(Comment,'comment')
                        .where('comment.taskId = :id AND comment.userId = :user',{id:id,user:user.id})
                        .getMany()
        return comment
    }

}

@Injectable()
export class CommentsService extends TypeOrmCrudService<Comment>{
    constructor(@InjectRepository(Comment) repo) {
        super(repo);
    }
}
