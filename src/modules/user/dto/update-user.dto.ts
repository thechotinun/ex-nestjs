import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  updatedBy?: number;
}
