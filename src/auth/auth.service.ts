import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { authCredentials } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './interface/jwt-payload-interface';



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService : JwtService
        )
    {}

    async SignUp(authCredentials): Promise<void>{
        return this.userRepository.signUp(authCredentials)
    }

    async SignIn(authCredentials: authCredentials): Promise< { accessToken: string} >{
        const username = await this.userRepository.signIn(authCredentials)
        
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const paylaod: jwtPayload = { username }
        const accessToken = this.jwtService.sign(paylaod)
        return {accessToken}
    }

}
