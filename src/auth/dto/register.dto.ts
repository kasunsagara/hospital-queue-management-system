import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(['donor', 'hospital', 'admin'])
  role?: string;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsNotEmpty()
  location: {
    type: string;
    coordinates: number[];
  };

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsOptional()
  availability?: boolean;
}
