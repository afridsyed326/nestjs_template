import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Country } from './schemas/country.schema';
import { Model } from 'mongoose';
import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {

    try {
      
    const createdCountry = new this.countryModel(createCountryDto);
    return createdCountry.save();
    } catch (error) {
      
    }

  }

  async findAll(): Promise<Country[]> {
    return this.countryModel.find().exec();
  }

  async findOne(id: string): Promise<Country> {
    return this.countryModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedCountry = await this.countryModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedCountry;
  }
}
