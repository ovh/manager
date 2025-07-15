import { Handler } from '@ovh-ux/manager-core-test-utils';
import { DedicatedServerVmacType, MacAddressTypeEnum } from '@/data/api';

export type GetDedicatedMocksParams = {
  hasVmac?: boolean;
};

export const getDedicatedMocks = ({
  hasVmac,
}: GetDedicatedMocksParams): Handler[] => [
  {
    url: '/dedicated/server/:server/virtualMac',
    response: (): DedicatedServerVmacType[] => {
      return hasVmac
        ? [{ macAddress: 'mac-address', type: MacAddressTypeEnum.OVH }]
        : [];
    },
    api: 'v6',
  },
];
