import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async getPropertiesList(
    @Query('address') address?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('price') price?: number,
    @Query('isForRent') isForRent?: boolean,
    @Query('isForSale') isForSale?: boolean,
  ) {
    const filters = {
      address,
      type,
      status,
      price,
      isForRent,
      isForSale,
    };
    return this.propertiesService.getPropertiesList(filters);
  }
}
