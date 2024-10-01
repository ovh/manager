import { CommercialCatalogTechnicalType } from '@/types/commercial-catalog.type';

type TechnicalParams = {
  name: string;
  bandwidthLevel: number;
  cpuCores: number;
  cpuFrequency: number;
  memorySize: number;
};

export const createTechnicalInfo = ({
  name,
  bandwidthLevel,
  cpuCores,
  cpuFrequency,
  memorySize,
}: TechnicalParams): CommercialCatalogTechnicalType => ({
  id: '1234',
  code: `public_cloud-cloud-${name}.consumption-FR`,
  version: 1,
  descriptions: [
    {
      longLabel: name,
    },
  ],
  commercialRatingValues: [
    {
      ratingValue: {
        type: 'PRICE',
        prices: [
          {
            currencyCode: 'EUR',
            amount: 132740000,
          },
        ],
      },
    },
  ],
  legacy: {
    plan: `${name}.consumption`,
    blobs: {
      content: {
        technical: {
          bandwidth: {
            guaranteed: false,
            level: bandwidthLevel,
            unlimited: true,
          },
          cpu: {
            cores: cpuCores,
            frequency: cpuFrequency,
            model: 'vCore',
            type: 'vCore',
          },
          memory: {
            size: memorySize,
          },
          name,
          os: {
            family: 'linux',
          },
          storage: {
            disks: [
              {
                capacity: 400,
                number: 1,
                technology: 'NVMe',
              },
            ],
            raid: 'local',
          },
        },
      },
    },
  },
});

const sizeList = ['8', '16', '32', '64', '128', '256'];

export const buildTechnicalInfosMock = (productCode: string) => {
  return sizeList.map((size) =>
    createTechnicalInfo({
      name: `${productCode}-${size}`,
      bandwidthLevel: 8000,
      cpuCores: 64,
      cpuFrequency: 2.3,
      memorySize: 24,
    }),
  );
};
