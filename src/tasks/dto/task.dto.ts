import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskdto {
    @ApiProperty()
    title : string;

    @ApiProperty()
    desctiption: string;
}