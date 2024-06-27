import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import mongoose from 'mongoose';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsMongoId()
  @IsNotEmpty()
  country: mongoose.Types.ObjectId;
}
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Validate((value, args) => value === args.object.password)
  confirmPassword: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  otp: string;
}
