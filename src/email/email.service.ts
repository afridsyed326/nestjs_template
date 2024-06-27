import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(user: User, otp: string) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Softbuilders Properties! Confirm your Email',
      template: './welcome',
      context: {
        name: user.firstName,
        otp,
      },
    });
  }

  async resetPasswordEmail(user: User, link: string) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Password Reset Request',
      template: './reset-password',
      context: {
        name: user.firstName,
        link,
      },
    });
  }
}
