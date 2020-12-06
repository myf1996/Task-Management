import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authCredentials } from './dto/auth-credential.dto';
import { User } from './auth.entity';
import { async } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorators';
import { PassportModule } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService ) {}

    @Post('/signup/')
    SignUp(@Body(ValidationPipe) authCredentials:authCredentials) : Promise<void> {
        return this.authService.SignUp(authCredentials)
    }

    @Post('/signin/')
    SignIn(@Body() authCredentials:authCredentials): Promise< { accessToken: string} > {
        return this.authService.SignIn(authCredentials)
        //const result =  this.authService.SignIn(authCredentials)
        //return 
    }

}
