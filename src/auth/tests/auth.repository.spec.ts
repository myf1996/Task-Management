import { UserRepository } from "../auth.repository";
import { Test } from "@nestjs/testing";
import { User } from "../auth.entity";

import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';


const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword' };

describe('UserRepository',() => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [
            UserRepository,
          ],
        }).compile();
        userRepository = await module.get<UserRepository>(UserRepository);
    });
  
    describe('signUp', () => {
      let save;
  
      beforeEach(() => {
        save = jest.fn();
        userRepository.create = jest.fn().mockReturnValue({ save });
      });
  
      it('successfully signs up the user',async () => {
        save.mockResolvedValue(undefined);
        expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
      });
  
      it('throws a conflict exception as username already exists', () => {
        save.mockRejectedValue({ code: '23505' });
        expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
      });
  
      it('throws a conflict exception as username already exists', () => {
        save.mockRejectedValue({ code: '123123' }); // unhandled error code
        expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
      });
    });


    describe('signIn', () =>{
        let user
        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = 'TestUsername';
            user.validateUserPassword = jest.fn();
        });

        it('user is validate', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validateUserPassword.mockResolvedValue(true)
            const result = await userRepository.signIn(mockCredentialsDto)
            expect(result).toEqual('TestUsername')
        })

        it('user not found',async () => {
            userRepository.findOne.mockResolvedValue(null)
            const result = await userRepository.signIn(mockCredentialsDto)
            expect(user.validateUserPassword).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })

        it('returns null as password is invalid',async () => {
          userRepository.findOne.mockResolvedValue(user);
          const result = await userRepository.signIn(mockCredentialsDto);
          user.validateUserPassword.mockResolvedValue(false);
          expect(user.validateUserPassword).toHaveBeenCalled();
          expect(result).toBeNull();
        });
    }) 

    

    describe('generatePasswordHash', () => {
      it('generate secure hash for Password from bcrypt', async () => {
        bcrypt.hash = jest.fn().mockReturnValue('testHash');
        expect(bcrypt.hash).not.toHaveBeenCalled()
        const result = await userRepository.generatePasswordHash('testPassword','testSalt');
        expect(bcrypt.hash).toHaveBeenCalledWith('testPassword','testSalt')
        expect(result).toEqual('testHash')
      })
    })
})