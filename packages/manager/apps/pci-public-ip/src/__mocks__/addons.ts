const catalog = {
  addons: [
    {
      planCode: 'pci-product.l-code-hour',
      product: 'pci-product-l',
      pricings: [{ price: 100, intervalUnit: 'hour' }],
      blobs: {
        technical: {
          name: 'large',
        },
      },
    },
    {
      planCode: 'pci-product.l-code-monthly',
      product: 'pci-product-l',
      pricings: [{ price: 3000, intervalUnit: 'monthly' }],
      blobs: {
        technical: {
          name: 'large',
        },
      },
    },
    {
      planCode: 'pci-product.s-code-hour',
      product: 'pci-product-s',
      pricings: [{ price: 50, intervalUnit: 'hour' }],
      blobs: {
        technical: {
          name: 'small',
        },
      },
    },
    {
      planCode: 'pci-product.s-code-monthly',
      product: 'pci-product-s',
      pricings: [{ price: 100, intervalUnit: 'monthly' }],
      blobs: {
        technical: {
          name: 'small',
        },
      },
    },
    {
      planCode: 'pci-productx.l-code-hour',
      product: 'pci-productx-l',
      pricings: [{ price: 90, intervalUnit: 'hour' }],
      blobs: {
        technical: {
          name: 'large',
        },
      },
    },
    {
      planCode: 'pci-productx.l-code-monthly',
      product: 'pci-productx-l',
      pricings: [{ price: 900, intervalUnit: 'monthly' }],
      blobs: {
        technical: {
          name: 'large',
        },
      },
    },
    {
      planCode: 'pci-productx.s-code-hour',
      product: 'pci-productx-s',
      pricings: [{ price: 20, intervalUnit: 'hour' }],
      blobs: {
        technical: {
          name: 'small',
        },
      },
    },
    {
      planCode: 'pci-productx.s-code-monthly',
      product: 'pci-productx-s',
      pricings: [{ price: 150, intervalUnit: 'monthly' }],
      blobs: {
        technical: {
          name: 'small',
        },
      },
    },
  ],
};

const regions = [
  {
    name: 'GRA-STAGING-A',
    datacenter: 'GRA',
    continentCode: 'EU',
    enabled: true,
    type: 'region',
    availabilityZones: [],
  },
  {
    name: 'EU-WEST-PAR',
    datacenter: 'PAR',
    continentCode: 'EU',
    enabled: true,
    type: 'region-3-az',
    availabilityZones: ['eu-west-par-a', 'eu-west-par-b', 'eu-west-par-c'],
  },
];

const availableProducts = {
  plans: [
    {
      code: 'pci-product.l-code-hour',
      regions,
    },
    {
      code: 'pci-product.l-code-monthly',
      regions,
    },
    {
      code: 'pci-product.s-code-monthly',
      regions,
    },
    {
      code: 'pci-product.s-code-hour',
      regions,
    },
  ],
  products: [],
};

const defaultAddons = [
  {
    planCode: 'pci-product.l-code-hour',
    product: 'pci-product-l',
    pricings: [{ price: 100, intervalUnit: 'hour' }],
    blobs: {
      technical: {
        name: 'large',
      },
    },
    regions,
  },
  {
    planCode: 'pci-product.s-code-hour',
    product: 'pci-product-s',
    pricings: [{ price: 50, intervalUnit: 'hour' }],
    blobs: {
      technical: {
        name: 'small',
      },
    },
    regions,
  },
];

export { catalog, availableProducts, regions, defaultAddons };
