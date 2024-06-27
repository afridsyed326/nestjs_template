import { INestApplicationContext } from '@nestjs/common';
import { Model } from 'mongoose';
import { PropertyBuilders } from '../properties/schemas/property-builder.schema';

export const runPropertiesScript = async (
  appContext: INestApplicationContext,
) => {
  const propertyBuildersModel = appContext.get<Model<PropertyBuilders>>(
    PropertyBuilders.name + 'Model',
  );

  const buildersData = [
    { name: 'Damac', key: 'DAMAC' },
    { name: 'Emaar', key: 'EMAAR' },
    { name: 'Omniyat', key: 'OMNIYAT' },
    { name: 'Sobha', key: 'SOBHA' },
    { name: 'Nakheel', key: 'NAKHEEL' },
    { name: 'Binghatti', key: 'BINGHATTI' },
    { name: 'Azizi', key: 'AZIZI' },
  ];

  await propertyBuildersModel.create(buildersData);
};
