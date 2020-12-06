import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, UseGuards, Logger, UseInterceptors, UploadedFile, UploadedFiles, Res } from '@nestjs/common';
import { TaskService,CommentsService } from './tasks.service';
import { CreateTaskdto } from './dto/task.dto';
import { Tasks,Comment } from './tasks.entity';
import { TaskFilterDto } from './dto/task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorators';
import { User } from '../auth/auth.entity';
import { Crud, CrudController } from "@nestjsx/crud";
import { Observable } from 'rxjs';
import { CommentDto } from './dto/comment-.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { QueueInjection } from 'nest-queue';
import { Queue } from 'bull';
import { BullService } from 'nestjs-bull';


@Controller('/tasks')
//@UseGuards(AuthGuard('jwt'))
export class TasksController {
    private logger = new Logger('TasksController')
    constructor(

        private taskservice: TaskService,
     
        ) {}

    @Get()
    getAllTasks(
        @Query() taskfilter: TaskFilterDto,
        @GetUser() user: User
        ): Promise<Tasks[]> {
        //this.logger.verbose(`getAlltask by ${user}`)
        return this.taskservice.getAllTasks(taskfilter,user)
    }

    @Post()
    createTask(
        @Body() CreateTaskdto: CreateTaskdto,
        @GetUser() user:User
        ): Promise<Tasks> {
        //this.logger.verbose(`createdTask by ${user}`)
        return this.taskservice.createTask(CreateTaskdto,user);
    }

    @Get(':id')
    getTaskbyId(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user:User
        ): Promise<Tasks> {
        return this.taskservice.getTaskbyId(id,user);
    }

    @Patch(':id')
    updateTaskbyId(
        @Param('id', ParseIntPipe) id:number,
        @Body() CreateTaskdto: CreateTaskdto,
        @GetUser() user: User
        
        ): Promise<Tasks> {
        return this.taskservice.updateTaskbyId(id,CreateTaskdto,user);
    }

    @Delete(':id')
    deleteTaskbyId(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user:User
    ): Promise<void> {
        return this.taskservice.deleteTaskbyId(id,user);
    }

    @Post(':id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user:User
    ): Promise<Tasks>  {
        return this.taskservice.updateTaskStatus(id,user)
    }

    @Post(':id/comment/')
    addCommentonTask(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user:User,
        @Body() commentDto:CommentDto
    ): Promise<Comment>  {
        return this.taskservice.addCommentonTask(id,user,commentDto)
    }

    @Get(':id/comment/')
    getAllCommentbyTaskId(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user:User,
    ): Promise<Comment[]> {
        return this.taskservice.getAllCommentbyTaskId(id,user)
    }

    @Get('microservices/all-task/')
    getMicroService(
        @GetUser() user:User
    ): Observable<string>{
        return this.taskservice.getMicroService(user)
    }

    @Post('file/upload/')
    @UseInterceptors(FilesInterceptor('image',5,{  //   FileInterceptor
        storage : diskStorage({
            destination: './uploads/tasks',
        })
    }))
    async fileUpload(@UploadedFiles() file){    //   UploadedFile
        //  FOR MULTIPLE FILES
        const response = [];
        file.forEach(file => {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
            };
            response.push(fileReponse);
        });


        //  FOR SINGLE FILE
        // const response = {
        //     originalname: file.originalname,
        //     filename: file.filename,
        // };
        // console.log("-----------",response)
        return response

    }

    @Get('file/upload/:imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: './uploads' });
    }
}



@Crud({
    model: {
      type: Comment,
    },
})
@Controller('comments')
export class CommentsController implements CrudController<Comment> {
    constructor(public service: CommentsService) {}
}