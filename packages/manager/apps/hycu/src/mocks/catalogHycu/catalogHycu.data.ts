import { IntervalUnitType } from '@ovh-ux/manager-react-components';
import { HYCUCatalog } from '@/types/orderCatalogHYCU.type';

export const catalog: HYCUCatalog = {
  plans: [
    {
      configurations: [
        {
          name: 'region',
          isCustom: false,
          isMandatory: true,
          values: ['europe', 'canada'],
        },
      ],
      invoiceName: 'HYCU Hybrid Cloud - Test VMs',
      planCode: 'hycu-vms-pack-test',
      pricings: [
        {
          capacities: ['installation'],
          intervalUnit: IntervalUnitType.none,
          price: 0,
          tax: 0,
        },
        {
          capacities: ['upgrade'],

          intervalUnit: IntervalUnitType.none,

          price: 0,
          tax: 0,
        },
        {
          capacities: ['renew'],

          intervalUnit: IntervalUnitType.month,

          price: 63000000000,
          tax: 12600000000,
        },
      ],
    },
    {
      planCode: 'hycu-vms-pack-test-2',
      invoiceName: 'HYCU Hybrid Cloud - Test 2 VMs',
      pricings: [
        {
          capacities: ['installation'],

          intervalUnit: IntervalUnitType.none,

          price: 0,
          tax: 0,
        },
        {
          capacities: ['upgrade'],

          intervalUnit: IntervalUnitType.none,

          price: 0,
          tax: 0,
        },
        {
          capacities: ['renew'],

          intervalUnit: IntervalUnitType.month,

          price: 94500000000,
          tax: 18900000000,
        },
      ],
      configurations: [
        {
          name: 'region',
          isCustom: false,
          isMandatory: true,
          values: ['europe', 'canada'],
        },
      ],
    },
  ],
};
