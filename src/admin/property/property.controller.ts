import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AddNewAddressDetailDto,
  CreatePropertyDto,
  PropertyBuilderDto,
} from './dto/admin-property.dto';
import { PropertiesService } from '../../properties/properties.service';
import { AdminJwtAuthGuard } from '../auth/admin.auth.guard';

@UseGuards(AdminJwtAuthGuard)
@Controller('admin/property')
export class PropertyController {
  constructor(private readonly propertyService: PropertiesService) {}

  @Post('builder')
  async addPropertyBuilder(@Body() propertyBuilderDto: PropertyBuilderDto) {
    const isValidKey = propertyBuilderDto.key.split(' ').length === 1;
    if (!isValidKey)
      throw new BadRequestException('key must be single word without spaces');
    return this.propertyService.addPropertyBuilder(propertyBuilderDto);
  }

  @Get('builder')
  async getPropertyBuildersList() {
    return await this.propertyService.getPropertyBuildersList();
  }

  @Post('address')
  async addNewAddressDetail(
    @Body() addNewAddressDetailDto: AddNewAddressDetailDto,
  ) {
    return await this.propertyService.addNewAddressDetail(
      addNewAddressDetailDto,
    );
  }

  @Post()
  async createPropertyListing(@Body() addPropertDto: CreatePropertyDto) {
    return await this.propertyService.createNewPropertyListing(addPropertDto);
  }

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
    return this.propertyService.getPropertiesList(filters);
  }
}
