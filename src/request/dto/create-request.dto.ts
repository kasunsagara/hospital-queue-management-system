import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  bloodGroup: string;

  @IsNumber()
  @IsNotEmpty()
  units: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(['high', 'normal'])
  urgency: string;
}
