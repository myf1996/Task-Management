import { JwtStretegy } from '../jwt-stretegy'
import { UserRepository } from '../auth.repository';
import { Test } from '@nestjs/testing';
import { User } from '../auth.entity';
import { async } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
    findOne : jest.fn(),
})

describe('JwtStretegy', () => {
    let jwtStretegy : JwtStretegy ;
    let userRepository ;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
        providers: [
            JwtStretegy,
            { provide: UserRepository ,useFactory:mockUserRepository },   
          ],
        }).compile();
        
        jwtStretegy = await module.get<JwtStretegy>(JwtStretegy);
        userRepository = await module.get<UserRepository>(UserRepository)
    });

    describe('validate', () => {
        it('user is validate of given access token', async () => {
            const user = new User()
            user.username = 'testUsername'
            userRepository.findOne.mockResolvedValue(user)
            const result = await jwtStretegy.validate({username : 'testUsername'})
            expect(userRepository.findOne).toBeCalledWith( {username : 'testUsername'} )
            expect(result).toEqual({username : 'testUsername'})

        })

        it('user is not validate of given access token', () => {
            userRepository.findOne.mockResolvedValue(null)
            const result =  jwtStretegy.validate({username : 'testUsername'})
            expect(result).rejects.toThrow(UnauthorizedException)
        })
    })

})