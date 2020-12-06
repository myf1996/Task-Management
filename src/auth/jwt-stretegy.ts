
import { PassportStrategy } from '@nestjs/passport';
import { Strategy , ExtractJwt } from 'passport-jwt'
import { jwtPayload } from './interface/jwt-payload-interface';
import { UserRepository } from './auth.repository';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { User } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStretegy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : 'topSecret51' ,
        })
    }


    async validate(payload : jwtPayload ): Promise<User> {
        const { username } = payload
        const user = await this.userRepository.findOne( {username} )

        if (!user){
            throw new UnauthorizedException() ;
        }
        return user
    }

}