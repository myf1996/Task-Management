
import { IsString, MinLength, Matches, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class authCredentials {
    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username : string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{message:'Passwords need to contain at least 1 upper, 1 lower case letter & 1 numeric or 1 special Character. '})
    password : string;
}