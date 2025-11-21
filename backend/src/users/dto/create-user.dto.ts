import { IsString, IsEmail, MinLength, MaxLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../user-roles.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(10, { message: 'Name must be at least 10 characters long' })
  @MaxLength(60, { message: 'Name must not exceed 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(16, { message: 'Password must not exceed 16 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character',
  })
  password: string;

  @IsString()
  @MaxLength(400, { message: 'Address can be max 400 characters long' })
  address: string;

  // Role is optional during signup (default is Normal User), 
  // but required if Admin is creating a user.
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role selection' })
  role?: UserRole;
}