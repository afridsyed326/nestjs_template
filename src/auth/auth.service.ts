import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/auth.dto';
import { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import { OTP_TOKEN_TYPES } from '../otp-tokens/schemas/otp-tokens.schema';
import { OtpTokensService } from '../otp-tokens/otp-tokens.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
    private verificationCodeService: OtpTokensService,
    private userService: UsersService,
    @Inject(ConfigService) private config: ConfigService,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload, {
      expiresIn: '24h',
    });
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      throw new BadRequestException('Please register before login');
      // return this.registerUser(user);
    }

    if (!(await bcrypt.compare(user.password, userExists?.password))) {
      throw new BadRequestException('Incorrect Password');
    }

    const token = this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
    return { token, user: await this.userService.getUserBasicData(userExists) };
  }

  async registerUser(user: RegisterUserDto) {
    const hashPass = await this.hashPassword(user.password);
    const newUser = await this.userModel.create({
      ...user,
      password: hashPass,
    });

    const otp = await this.verificationCodeService.createVerificationCode(
      newUser,
      OTP_TOKEN_TYPES.EMAIL_VERIFICATION,
    );

    this.emailService.sendUserWelcome(newUser, otp.code);

    const token = this.generateJwt({
      sub: newUser.id,
      email: newUser.email,
    });

    return {
      token,
      user: this.userService.getUserBasicData(newUser),
    };
  }

  async findUserByEmail(email) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return null;
    }

    return user;
  }

  async verifyEmail(otp: string, userId: Schema.Types.ObjectId) {
    const isOtpValid: any =
      await this.verificationCodeService.checkIfCodeIsValid(
        otp,
        userId,
        OTP_TOKEN_TYPES.EMAIL_VERIFICATION,
      );

    if (!isOtpValid) {
      throw new BadRequestException('Invalid otp code');
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    this.verificationCodeService.markCodeAsUsed(isOtpValid._id);
    user.emailVerified = true;
    await user.save();
    return 'Email verified!';
  }

  async forgotPasswordRequest(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('No user exists with this email');

    const token = this.generateJwt({
      sub: user._id,
      email: user.email,
    });

    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const link = `${frontendUrl}/reset-password?token=${token}`;

    this.emailService.resetPasswordEmail(user, link);
    return 'Reset Password Email Sent';
  }

  async resetPassword(password: string, userId: Schema.Types.ObjectId) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const hashPass = await this.hashPassword(password);
    user.password = hashPass;
    await user.save();

    return 'Password reset successfully';
  }
}
