import { Tasks, Comment } from "./tasks.entity";
import { Repository, EntityRepository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./interface/task.interface";


@EntityRepository(Tasks)
export class TaskRepository extends Repository<Tasks> {
    
    async getAllTasks(taskfilter,user){
        const qs = this.createQueryBuilder('task');

        qs.where('task.userId =:userId',{ userId:user.id })
        if (taskfilter.status){
            const status = taskfilter.status
            qs.andWhere('task.status =:status',{ status })
        }
        if (taskfilter.search){
            const search = taskfilter.search
            qs.andWhere('( task.title LIKE :search OR task.description LIKE :search )',{ search : `%${search}` })
        }
        const task = await qs.getMany()
        return task
    }

    async getTaskbyId(id,user){
        const found = await this.findOne({ where: {id , userId:user.id} })    
        if (!found){
            throw new NotFoundException()
        }
        return found
    }

    async createTask(CreateTaskdto,user){
        const task = new Tasks()
        task.title = CreateTaskdto.title
        task.description = CreateTaskdto.description
        task.status = TaskStatus.OPEN
        task.user = user
        await task.save()

        delete task.user
        return task
    }

    async updateTaskbyId(id, CreateTaskdto, user){
        const task = await this.getTaskbyId(id,user)
        task.title = CreateTaskdto.title
        task.description= CreateTaskdto.description
        await task.save()
        return task
    }

    async deleteTaskbyId(id,user){
        const result = await this.delete( { id, userId : user.id });
        if (result.affected === 0){
            throw new NotFoundException()
        }
        return
    }

    async updateTaskStatus(id,user){
        const task = await this.getTaskbyId(id,user)
        if (task.status == TaskStatus.OPEN ){
            task.status = TaskStatus.PROGRESS
        }
        else if (task.status == TaskStatus.PROGRESS){
            task.status = TaskStatus.DONE
        }
        await task.save()
        return task
    }


    async addCommentonTask(id,user,commentDto){
        const task = await this.getTaskbyId(id,user)
        const com = new Comment()
        com.comment = commentDto.comment
        com.task = task
        com.user = user
        com.save()
        return com
    }
}