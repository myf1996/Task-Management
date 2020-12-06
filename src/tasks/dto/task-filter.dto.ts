import { TaskStatus } from "../interface/task.interface";
import { ApiBody, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class TaskFilterDto {
    @ApiPropertyOptional( { enum : [TaskStatus.OPEN,TaskStatus.PROGRESS,TaskStatus.DONE] })
    status:TaskStatus;

    @ApiPropertyOptional()
    search:string;
    
}