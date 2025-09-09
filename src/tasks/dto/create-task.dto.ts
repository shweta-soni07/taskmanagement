// src/tasks/dto/create-task.dto.ts
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
} from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish README', description: 'Title of the task' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Work on documentation',
    description: 'Details about the task',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'Status of the task',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'Due date for the task',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the category this task belongs to',
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}
