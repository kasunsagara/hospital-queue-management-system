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
  patientId: string;

  @IsNotEmpty()
  location: {
    type: string;
    coordinates: number[];
  };

  @IsEnum(['high', 'normal'])
  urgency: string;
}
