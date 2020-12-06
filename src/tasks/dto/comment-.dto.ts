import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
    @ApiProperty()
    comment : string;
    
}