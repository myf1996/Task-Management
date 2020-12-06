import { UserRepository } from "../auth.repository";
import { Test } from "@nestjs/testing";
import { User } from "../auth.entity";
import * as bcrypt from 'bcrypt';
import { async } from "rxjs";


describe('UserEntity', ()=> {
    let user 
    beforeEach(async () => {
        user = new User()
        
        user.password = 'testPassword'
        user.salt = 'testSalt'
        bcrypt.hash = jest.fn()
    });

    describe('validateUserPassword',() => {
        it('password sucessful', async () => {
            bcrypt.hash.mockReturnValue('testPassword')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await user.validateUserPassword('12345');
            expect(bcrypt.hash).toHaveBeenCalledWith('12345','testSalt')
            expect(result).toEqual(true)
        })

        it('password unsucessful',async () =>{
            bcrypt.hash.mockReturnValue('testPassword1')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await user.validateUserPassword('testPassword1');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword1','testSalt')
            expect(result).toEqual(false)
        })
    })
})