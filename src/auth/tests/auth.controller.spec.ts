import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { UserRepository } from '../auth.repository';
import { JwtService } from '@nestjs/jwt';


// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';

// describe('AuthController', () => {
//   let controller: AuthController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//     }).compile();

//     controller = module.get<AuthController>(AuthController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });


// describe('AuthController', () => {
//   let authController: AuthController;
//   let authService: AuthService;

//   beforeEach(() => {
//     authService = new AuthService();
//     authController = new AuthController(authService);

//   });
//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       const result = ['test'];
//       jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

//       expect(await catsController.findAll()).toBe(result);
//     });
//   });
// }


describe('AuthController',() => {
  it('testing',async () => {
    expect(true).toEqual(true)
  })
})