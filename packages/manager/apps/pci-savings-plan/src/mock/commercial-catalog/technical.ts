import { TechnicalInfo } from '@/types/commercial-catalog.type';

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
}: TechnicalParams): TechnicalInfo => ({
  id: '1234',
  code: `public_cloud-cloud-${name}.consumption-FR`,
  version: 1,
  description: {
    defaultLanguage: 'FR',
    originalLanguage: 'FR',
    localDescriptions: [
      {
        language: 'FR',
        longLabel: name,
        shortLabel: name,
        translationStatus: 'OK',
      },
    ],
  },
  ratingModels: [
    {
      charge: {
        processingStrategy: 'TIERED',
        type: 'ATOMIC',
        ratingMode: 'QUANTITY',
        atomicCharge: {
          chargeType: 'CONSUMPTION',
          consumptionCharge: {
            aggregationPeriod: 'HOUR',
            aggregationType: 'INSTANCE',
            roundingPolicy: 'ROUNDING',
          },
        },
      },
    },
  ],
  commercialRatingValues: [
    {
      chargeId: 'consumption_consumption_1_hour',
      ratingValue: {
        type: 'PRICE',
        priceRatingValue: {
          prices: [
            {
              currencyCode: 'EUR',
              amount: 132740000,
            },
          ],
        },
      },
    },
  ],
  archivable: false,
  validity: {
    startDate: '2024-06-25T07:51:52.807Z',
  },
  legacy: {
    plan: `${name}.consumption`,
    blob: {
      content: {
        commercial: {
          brick: 'guaranteed-resources',
          brickSubtype: 'cpu',
          name,
          price: {
            interval: 'PT1H',
            precision: 4,
            unit: 'h',
          },
        },
        tags: ['active', 'coming_soon', 'is_new'],
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
          vrack: {
            guaranteed: false,
            level: 8000,
            unlimited: false,
          },
        },
      },
    },
    catalog: {
      id: 2247,
      name: 'cloud',
    },
  },
  type: 'ATOMIC',
  nature: 'REGULAR',
  customerVisible: true,
  atomicOffer: {
    atomicOfferCommercialProduct: {
      commercialProduct: {
        code: name,
        description: {
          defaultLanguage: 'FR',
          originalLanguage: 'FR',
          localDescriptions: [
            {
              language: 'FR',
              longLabel: 'Public Cloud Instance',
              shortLabel: 'Public Cloud Instance',
              translationStatus: 'OK',
            },
          ],
        },
        type: 'ATOMIC',
        configFields: [
          {
            name: 'instanceId',
            type: 'CUSTOM',
            mandatory: false,
            defaultValue: '',
          },
          {
            name: 'instanceParams',
            type: 'CUSTOM',
            mandatory: false,
            defaultValue: '',
          },
        ],
      },
      min: 1,
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
