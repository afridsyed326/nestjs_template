import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { Model, Schema } from 'mongoose';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    // const extractJwtFromCookie = (req) => {
    //   let token = null;
    //   if (req && req.cookies) {
    //     token = req.cookies['access_token'];
    //   }
    //   return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    // };

    super({
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel.findById(payload.sub);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
