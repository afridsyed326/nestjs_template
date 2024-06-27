import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_TYPES, User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { aggregatePaginate } from '../utils/pagination.service';
import { PropertyBuilders } from '../properties/schemas/property-builder.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PropertyBuilders.name)
    private propertyBuilderModel: Model<PropertyBuilders>,
    private jwtService: JwtService,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload, {
      expiresIn: '24h',
    });
  }

  async adminLogin(email: string, password: string) {
    const admin = await this.userModel.findOne({
      email,
      type: USER_TYPES.ADMIN,
    });
    if (!admin) {
      throw new BadRequestException('Invalid email or password');
    }
    if (!(await bcrypt.compare(password, admin.password))) {
      throw new BadRequestException('Incorrect Password');
    }
    const token = this.generateJwt({
      sub: admin._id,
      email: admin.email,
    });
    return {
      token,
      user: { email, firstName: admin.firstName, lastName: admin.lastName },
    };
  }

  async getUsersList(page: string, limit: string) {
    const users = await aggregatePaginate(
      this.userModel,
      [],
      Number(page),
      Number(limit),
    );
    return users;
  }
}
