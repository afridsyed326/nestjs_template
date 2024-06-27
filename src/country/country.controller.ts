import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Param,
  Delete,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Country } from './schemas/country.schema';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';
import { TransformInterceptor } from '../interceptor/transform.interceptor';

@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TransformInterceptor)
@Controller('country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Post()
  async create(@Body() createCountryDto: CreateCountryDto) {
    return await this.countryService.create(createCountryDto);
  }

  @Get()
  async findAll(): Promise<Country[]> {
    return this.countryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Country> {
    console.log(typeof id === 'string'); // true
    console.log({ id });

    return this.countryService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.countryService.delete(id);
  }
}
