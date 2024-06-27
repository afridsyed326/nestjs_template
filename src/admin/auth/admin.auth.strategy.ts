import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { USER_TYPES, User } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel.findById(payload.sub);
    if (user.type !== USER_TYPES.ADMIN)
      throw new UnauthorizedException('Unauthorized');

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
