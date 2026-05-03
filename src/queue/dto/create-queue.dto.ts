import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQueueDto {
  @IsString()
  @IsNotEmpty()
  service: string;
}
