import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStretegy } from './jwt-stretegy';


@Module({
  imports:[ 
    PassportModule.register({defaultStrategy : 'jwt'}),
    JwtModule.register({
      secret:'topSecret51',
      signOptions:{
        expiresIn:3600
      },
    }),
    TypeOrmModule.forFeature([UserRepository],)
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStretegy
  ],
  exports:[
    JwtStretegy,
    PassportModule,
  ]
})
export class AuthModule {}
