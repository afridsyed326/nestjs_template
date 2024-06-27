import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getUserOnboardingStep(user: User) {
    if (!user.emailVerified) return 'email-verification';
    return 'dashboard';
  }

  async getUserBasicData(user: User) {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      onboardingStep: this.getUserOnboardingStep(user),
    };
  }

  async updateUser(userId: string, newData: any) {
    return this.userModel.findByIdAndUpdate(userId, newData, { new: true });
  }
}
