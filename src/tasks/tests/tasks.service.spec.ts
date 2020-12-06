import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../tasks.service';
import { TaskRepository } from '../tasks.repository';
import { TaskFilterDto } from '../dto/task-filter.dto';
import { TaskStatus } from '../interface/task.interface';
import { async } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskdto } from '../dto/task.dto';
import { CommentDto } from '../dto/comment-.dto';


const mockUser = {
    id: 1,
    username:'Test User'
}

const mockTaskRepository = () => ({
    getAllTasks: jest.fn(),     // get all task
    getTaskbyId: jest.fn(),     // get task by id
    createTask: jest.fn(),      // create new task
    updateTaskbyId: jest.fn(),  // update task by id
    deleteTaskbyId: jest.fn(),  // delete task by id
    updateTaskStatus: jest.fn(),// update task status
    addCommentonTask: jest.fn() // add comment on task
});

describe('TaskService', () => {
    let taskService ;
    let taskRepository ;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
              providers: [
                  TaskService,
                  { provide: TaskRepository ,useFactory:mockTaskRepository },
                ],
            }).compile();

        taskService = await module.get<TaskService>(TaskService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });
    

    describe('getAllTasks' ,() => {
        it('all tasks from the repository ', async () => {
            expect(taskRepository.getAllTasks).not.toHaveBeenCalled();
            taskRepository.getAllTasks.mockResolvedValue('testing title');
            const filters : TaskFilterDto = { status: TaskStatus.PROGRESS , search: 'testing title' };
            const result = await taskService.getAllTasks(filters,mockUser);
            expect(taskRepository.getAllTasks).toHaveBeenCalled();
            expect(result).toEqual('testing title');
            
        })
    })

    describe('getTaskbyId',() => {
        it('get task by id', async ()=> {
            const mockTesk = { 'title' : 'testing title', 'description': 'testing description'}
            taskRepository.getTaskbyId.mockResolvedValue(mockTesk)
            const result = await taskService.getTaskbyId(1,mockUser)
            expect(result).toEqual(mockTesk)
            expect(taskRepository.getTaskbyId).toHaveBeenCalledWith(1,mockUser)
        })

        it('Error if task by id not found', async ()=> {
            await taskRepository.getTaskbyId.mockResolvedValue(null)
            expect(taskService.getTaskbyId(1,mockUser) ).rejects.toThrow(NotFoundException)
        })
    })

    describe('createTask',() => {
        it('create a new task with status Open',async () => {
            taskRepository.createTask.mockResolvedValue('hello world');

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskdto : CreateTaskdto = { title : 'test title', desctiption : 'test description'}
            const creTask = await taskService.createTask(createTaskdto,mockUser);
            expect(taskRepository.createTask).toHaveBeenCalled();
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskdto,mockUser);
            expect(creTask).toEqual('hello world')
            
        })
    })


    describe('updateTaskbyId',() => {
        it('create a new task with status Open',async () => {
            expect(taskRepository.updateTaskbyId).not.toHaveBeenCalled();

            const createTaskdto : CreateTaskdto = { title : 'test title', desctiption : 'test description'}
            taskRepository.updateTaskbyId.mockResolvedValue(1,createTaskdto,mockUser)
            const creTask = await taskService.updateTaskbyId(1,createTaskdto,mockUser);
            expect(taskRepository.updateTaskbyId).toHaveBeenCalled();
            expect(taskRepository.updateTaskbyId).toHaveBeenCalledWith(1,createTaskdto,mockUser);

        })
    })

    describe('deleteTaskbyId', () => {
        it('delete a task with ID if found',async () => {
            taskRepository.deleteTaskbyId.mockResolvedValue(1) // affected values 
            expect(taskRepository.deleteTaskbyId).not.toHaveBeenCalled();
            const delTask = await taskService.deleteTaskbyId(1,mockUser)
            expect(taskRepository.deleteTaskbyId).toHaveBeenCalled();
            expect(taskRepository.deleteTaskbyId).toHaveBeenCalledWith(1,mockUser)

        })
    })

    describe('deleteTaskbyId', () => {
        it('ERROR : delete a task with ID if not found',async () => {
            await taskRepository.deleteTaskbyId.mockResolvedValue(0) // affected values 
            expect(taskRepository.deleteTaskbyId).rejects.toThrow(NotFoundException)
        })
    })


    describe('updateTaskStatus', () => {
        it('updateTaskStatus from previous status except DONE',async () => {
            expect(taskRepository.updateTaskStatus).not.toHaveBeenCalled();
            await taskService.updateTaskStatus(1,mockUser)
            expect(taskRepository.updateTaskStatus).toHaveBeenCalled();
            expect(taskRepository.updateTaskStatus).toHaveBeenCalledWith(1,mockUser)
        })

        it('ERROR task not fount in updateTaskStatus',async () => {
            await taskRepository.updateTaskStatus.mockResolvedValue(null) // affected values 
            expect(taskRepository.updateTaskStatus).rejects.toThrow(NotFoundException)
        })
    })

    describe('addCommentonTask',() => {
        it('addCommentonTask on Task',async () => {
            expect(taskRepository.addCommentonTask).not.toHaveBeenCalled();
            const commentDto : CommentDto = { comment:'testing Comment' }
            await taskService.addCommentonTask(1,mockUser,commentDto)
            expect(taskRepository.addCommentonTask).toHaveBeenCalled();
            expect(taskRepository.addCommentonTask).toHaveBeenCalledWith(1,mockUser,commentDto);
        })

        it('Error if task by id not found', async ()=> {
            const commentDto : CommentDto = { comment:'testing Comment' }
            await taskRepository.addCommentonTask.mockResolvedValue(null)
            expect(taskService.addCommentonTask(1,mockUser,commentDto) ).rejects.toThrow(NotFoundException)
        })
    })
        
})