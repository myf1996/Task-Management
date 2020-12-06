import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { TaskStatus } from "./interface/task.interface";
import { User } from "./../auth/auth.entity";


@Entity()
export class Tasks extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string

    @Column()
    description:string

    @Column()
    status:TaskStatus
    
    @ManyToOne(() => User, user => user.tasks ,{ eager : false , nullable:true })
    user : User;

    @Column({ nullable: true })
    userId : number

    @OneToMany(() => Comment, comment => comment.task ,{ eager : false, nullable:true,cascade: true  })
    comment : Comment[];
}



@Entity()
export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @ManyToOne(() => Tasks, task => task, {eager:true ,nullable:true} )
    task: Tasks

    @Column({ nullable: true })
    taskId: number

    @ManyToOne(() => User, user => user.comment, {eager:true, nullable:true})
    user: User

    @Column({ nullable: true })
    userId: number
}
