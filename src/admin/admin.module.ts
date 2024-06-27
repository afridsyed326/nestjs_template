import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminJwtStrategy } from './auth/admin.auth.strategy';
import {
  PropertyBuilders,
  PropertyBuildersSchema,
} from '../properties/schemas/property-builder.schema';
import { PropertiesModule } from '../properties/properties.module';
import { PropertyController } from './property/property.controller';
import { PropertiesService } from '../properties/properties.service';
import {
  Property,
  PropertySchema,
} from '../properties/schemas/property.schema';
import {
  PropertyAddressParts,
  PropertyAddressPartsSchema,
} from '../properties/schemas/address-part.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PropertyBuilders.name, schema: PropertyBuildersSchema },
      { name: Property.name, schema: PropertySchema },
      { name: PropertyAddressParts.name, schema: PropertyAddressPartsSchema },
    ]),
    UsersModule,
    PropertiesModule,
  ],
  controllers: [AdminController, PropertyController],
  providers: [AdminService, JwtService, AdminJwtStrategy, PropertiesService],
})
export class AdminModule {}
