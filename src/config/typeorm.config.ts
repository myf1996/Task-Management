import { TypeOrmModuleOptions } from "@nestjs/typeorm";


export const typeOrmConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'demo-testing-task-manager',
    entities: [__dirname + "/../**/*.entity.{ts,js}"],
    synchronize: true,
}