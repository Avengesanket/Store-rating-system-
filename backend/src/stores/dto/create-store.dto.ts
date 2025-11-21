import { IsString, IsEmail, MinLength, MaxLength, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  name: string;

  @IsString()
  @MaxLength(400, { message: 'Address cannot exceed 400 characters' })
  address: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Owner ID must be a valid UUID' })
  ownerId: string; 
}