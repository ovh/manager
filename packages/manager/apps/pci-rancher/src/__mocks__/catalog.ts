import { TCatalog } from '@ovh-ux/manager-pci-common';
import { RancherPlanCode } from '@/types/api.type';

export const mockCatalog: TCatalog = ({
  addons: [
    {
      planCode: RancherPlanCode.OVHCLOUD_EDITION,
      pricings: [
        {
          price: 100,
          capacities: ['consumption'],
          mode: '',
          phase: 0,
          commitment: 0,
          description: '',
          tax: 0,
          interval: 0,
          intervalUnit: '',
          quantity: {
            max: 0,
            min: 0,
          },
          repeat: {
            max: 0,
            min: 0,
          },
          strategy: '',
          mustBeCompleted: false,
          type: '',
          promotions: [],
        },
      ],
      invoiceName: '',
      blobs: {
        commercial: {
          name: '',
        },
      },
    },
    {
      planCode: RancherPlanCode.STANDARD,
      pricings: [
        {
          price: 50,
          capacities: [],
          mode: '',
          phase: 0,
          commitment: 0,
          description: '',
          tax: 0,
          interval: 0,
          intervalUnit: '',
          quantity: {
            max: 0,
            min: 0,
          },
          repeat: {
            max: 0,
            min: 0,
          },
          strategy: '',
          mustBeCompleted: false,
          type: '',
          promotions: [],
        },
      ],
      invoiceName: '',
      blobs: {
        commercial: {
          name: '',
        },
      },
    },
  ],
  catalogId: '',
  locale: {
    currencyCode: '',
    subsidiary: '',
    taxRate: 0,
  },
  plans: [],
} as unknown) as TCatalog;
