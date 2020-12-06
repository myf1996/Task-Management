import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
//import { Task, Comment } from "src/tasks/tasks.entity";
import { Tasks, Comment } from "./../tasks/tasks.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    username:string

    @Column()
    password:string

    @Column()
    salt:string

    @OneToMany(() => Tasks, task => task.user ,{ eager : false , nullable:true})
    tasks: Tasks[];

    @OneToMany(() => Comment, comment => comment.user ,{ eager : false , nullable:true})
    comment: Comment[];

    async validateUserPassword(password : string): Promise<Boolean>{
        const hash = await bcrypt.hash(password,this.salt);
        return hash === this.password;
    }
}