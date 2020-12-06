
import { Repository, EntityRepository } from "typeorm";
import { User } from "./auth.entity";
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './interface/jwt-payload-interface';
import { promises } from "fs";


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    // constructor(private jwtService : JwtService){
    //     super()
    // }

    async signUp(authCredentials): Promise<void> {
        const user = this.create()
        user.username = authCredentials.username
        user.salt = await bcrypt.genSalt()
        user.password = await this.generatePasswordHash(authCredentials.password,user.salt)
        try {
            await user.save()
        } catch (error) {
            if (error.code === '23505' ){
                throw new ConflictException('Username Already Exists');
            }
            else{
                throw new InternalServerErrorException()
            }
        }
        return
    }

    async signIn(authCredentials): Promise<string>{
        const { username , password } = authCredentials
        const user = await this.findOne({ username })

        if (user &&  user.validateUserPassword(password) ){ 
            const username = user.username
            return username ;  
        }else{
            return null;
        }
    }

    private async generatePasswordHash(password: string,salt: string): Promise<string> {
        return bcrypt.hash(password,salt)
    }

    // async validateUserPassword(user:User, password : string): Promise<Boolean>{
    //     const hash = await bcrypt.hash(password,user.salt);
    //     return hash === user.password;
    // }
}