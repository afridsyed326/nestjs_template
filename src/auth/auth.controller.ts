import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import {
  LoginDto,
  RegisterUserDto,
  ResetPasswordDto,
  ResetPasswordRequestDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// @UseInterceptors(LoggingInterceptor)
@UseInterceptors(TransformInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.signIn(req.user);

    // res.cookie('access_token', token, {
    //   maxAge: 2592000000,
    //   sameSite: true,
    //   secure: false,
    // });
    return res.redirect(`http://localhost:3000/signin/google?token=${token}`);
  }

  @Post('signup')
  async create(@Body() createUserDto: RegisterUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }

  @Post('forgot-password')
  async requestForgotPassword(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
  ) {
    return await this.authService.forgotPasswordRequest(resetPasswordDto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async ressetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: any,
  ) {
    return await this.authService.resetPassword(
      resetPasswordDto.password,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/verify')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Req() req: any) {
    return await this.authService.verifyEmail(verifyEmailDto.otp, req.user.id);
  }
}
