const regions = [
  {
    name: 'GRA-STAGING-A',
    datacenter: 'GRA',
    continentCode: 'EU',
    enabled: true,
    type: 'region',
    availabilityZones: [],
  },
];

const availableGateway = {
  plans: [
    {
      code: 'gateway.2xl.hour.consumption',
      regions,
    },
    {
      code: 'gateway.2xl.month.consumption',
      regions,
    },
    {
      code: 'gateway.s.hour.consumption',
      regions,
    },
    {
      code: 'gateway.s.hour.consumption.3AZ',
      regions: [
        {
          name: 'EU-WEST-PAR',
          datacenter: 'PAR',
          continentCode: 'EU',
          enabled: true,
          type: 'region-3-az',
          availabilityZones: [
            'eu-west-par-a',
            'eu-west-par-b',
            'eu-west-par-c',
          ],
        },
      ],
    },
    {
      code: 'gateway.s.month.consumption',
      regions: [
        ...regions,
        {
          name: 'UK1',
          datacenter: 'UK',
          continentCode: 'EU',
          enabled: true,
          type: 'region',
          availabilityZones: [],
        },
      ],
    },
  ],
  products: [],
};

const catalog = {
  catalogId: 'testId',
  locale: {
    currencyCode: 'EUR',
    subsidiary: 'FR',
    taxRate: 20,
  },
  plans: [],
  addons: [
    {
      planCode: 'gateway.xl.month.consumption',
      invoiceName: 'Public Cloud Gateway XL',
      product: 'publiccloud-gateway-xl',
      pricings: [
        {
          price: 12000000000,
        },
      ],
    },
    {
      planCode: 'gateway.s.month.consumption',
      invoiceName: 'Public Cloud Gateway Small',
      product: 'publiccloud-gateway-s',
      pricingType: 'consumption',
      pricings: [
        {
          price: 200000000,
        },
      ],
    },
    {
      planCode: 'gateway.s.hour.consumption',
      invoiceName: 'Public Cloud Gateway Small',
      product: 'publiccloud-gateway-s',
      pricingType: 'consumption',
      pricings: [
        {
          price: 280000,
        },
      ],
    },
    {
      planCode: 'gateway.xl.hour.consumption',
      invoiceName: 'Public Cloud Gateway XL',
      product: 'publiccloud-gateway-xl',
      pricingType: 'consumption',
      pricings: [
        {
          price: 16670000,
        },
      ],
    },
  ],
};

export { availableGateway, catalog };
