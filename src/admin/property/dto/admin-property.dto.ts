import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PROPERTY_STATUS,
  PROPERTY_TYPES,
} from '../../../properties/schemas/property.schema';

export class PropertyBuilderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  key: string;
}

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  referanceNumber: string;

  @IsString()
  @IsNotEmpty()
  permitNumber: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_TYPES)
  type: string;

  // @IsMongoId()
  // @IsNotEmpty()
  // location: string;

  @IsMongoId()
  @IsNotEmpty()
  builder: string;

  @IsMongoId()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsBoolean()
  isForRent?: boolean;

  @IsOptional()
  @IsBoolean()
  isForSale?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_STATUS)
  status: string;

  @IsOptional()
  @IsNumber()
  sizeInSqFeet?: number;

  @IsOptional()
  @IsNumber()
  pricePerSqFt?: number;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  postedDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deliveryDate?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsNumber()
  parkingSlots?: number;

  @IsOptional()
  @IsString()
  floorPlanLink?: string;

  @IsOptional()
  @IsString()
  brochureLink?: string;
}

export class AddNewAddressDetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsMongoId()
  parent?: string;
}
