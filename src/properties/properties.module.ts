import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PropertyBuilders,
  PropertyBuildersSchema,
} from './schemas/property-builder.schema';
import {
  PropertyLocation,
  PropertyLocationSchema,
} from './schemas/property-location.schema';
// import {
//   PropertyAddressWeb,
//   PropertyAddressWebSchema,
// } from './schemas/address-web.schema';
import {
  PropertyMainUnit,
  PropertyMainUnitSchema,
} from './schemas/property-main-unit.schema';
import { PropertySchema, Property } from './schemas/property.schema';
import {
  PropertyAddressParts,
  PropertyAddressPartsSchema,
} from './schemas/address-part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
      { name: PropertyBuilders.name, schema: PropertyBuildersSchema },
      { name: PropertyLocation.name, schema: PropertyLocationSchema },
      { name: PropertyMainUnit.name, schema: PropertyMainUnitSchema },
      { name: PropertyAddressParts.name, schema: PropertyAddressPartsSchema },
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
