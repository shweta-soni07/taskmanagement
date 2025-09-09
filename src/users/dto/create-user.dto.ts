import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Alice', description: 'Name of the user' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'alice@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user',
  })
  @MinLength(6)
  password: string;
}
