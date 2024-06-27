import { Module, Global, BadRequestException } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './schemas/country.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Country.name,
        useFactory: () => {
          const schema = CountrySchema;
          schema.pre('save', function () {
            try {
              // 1. Data Validation
              if (!this.name) {
                throw new Error('Name is required.');
              }

              // 2. Data Transformation
              this.name = this.name.toUpperCase(); // Convert name to uppercase


              // 4. Audit Logging
              console.log(`Saving country: ${this.name}`);

            } catch (error) {
              throw new Error(`Failed to save country: ${error.message}`);
            }
          });
          // schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {
  constructor(private countryService: CountryService) {}
}
