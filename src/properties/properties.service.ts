import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PROPERTY_BUILDERS_CNAME,
  PropertyBuilders,
} from './schemas/property-builder.schema';
import { Model } from 'mongoose';
import { Property } from './schemas/property.schema';
import { AddNewAddressDetailDto } from '../admin/property/dto/admin-property.dto';
import {
  PROPERTY_ADDRESS_PARTS_CNAME,
  PropertyAddressParts,
} from './schemas/address-part.schema';
import { aggregatePaginate } from '../utils/pagination.service';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(PropertyBuilders.name)
    private propertyBuilderModel: Model<PropertyBuilders>,
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    @InjectModel(PropertyAddressParts.name)
    private propertyAddressPartModel: Model<PropertyAddressParts>,
  ) {}

  async addPropertyBuilder(propertyBuilderDto) {
    const propertyBuilder = await this.propertyBuilderModel.create({
      name: propertyBuilderDto.name,
      key: propertyBuilderDto.key.toUpperCase(),
    });

    return propertyBuilder;
  }

  async getPropertyBuildersList() {
    return await this.propertyBuilderModel
      .find({})
      .sort('-createdAt')
      .select('name key');
  }

  async createNewPropertyListing(propertyDto) {
    return await this.propertyModel.create({ ...propertyDto });
  }

  getCleanListingFilters(filters) {
    const { name, address, type, status, price, isForRent, isForSale } =
      filters;
    let config = Object.fromEntries(
      Object.entries({
        name,
        address,
        type,
        status,
        price,
        isForRent,
        isForSale,
      }).filter(([_, value]) => value !== undefined),
    );
    return config;
  }

  async getPropertiesList(filters) {
    let config = this.getCleanListingFilters(filters);
    const { name } = config;

    if (name) {
      config = {
        ...config,
        $and: [
          {
            name: {
              $regex: name,
              $options: 'i',
            },
          },
        ],
      };
    }

    const pipeline = [
      {
        $lookup: {
          from: PROPERTY_BUILDERS_CNAME,
          localField: 'builder',
          foreignField: '_id',
          as: 'builder',
          pipeline: [{ $project: { key: 1, name: 1 } }],
        },
      },
      { $unwind: '$builder' },
      {
        $lookup: {
          from: PROPERTY_ADDRESS_PARTS_CNAME,
          localField: 'address',
          foreignField: '_id',
          as: 'address',
          pipeline: [{ $project: { key: 1, name: 1 } }],
        },
      },
      { $unwind: '$address' },
      { $match: config },
    ];
    return await aggregatePaginate(this.propertyModel, pipeline);
  }

  async addNewAddressDetail(newAddressData: AddNewAddressDetailDto) {
    const session = await this.propertyAddressPartModel.db.startSession();
    session.startTransaction();
    try {
      const key = newAddressData.name.split(' ').join('_').toUpperCase();
      const newAddress: any = await this.propertyAddressPartModel.create(
        [
          {
            ...newAddressData,
            key,
          },
        ],
        { session },
      );
      if (newAddressData.parent) {
        const parent = await this.propertyAddressPartModel
          .findById(newAddressData.parent)
          .session(session);
        if (!parent) {
          throw new BadRequestException('Invalid parent id');
        }
        parent.children.push(newAddress[0]._id);
        await parent.save({ session });
      }
      await session.commitTransaction();
      return newAddress[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
