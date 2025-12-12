import {
  mockedOvhPrivateNetwork,
  mockedPrivateNetworks,
} from '@/__mocks__/instance/constants';
import { formatDateToDDMMYY } from '@/utils';

export const selectPrivateNetworks = (region: string) => ({
  networks: mockedPrivateNetworks,
  ovhPrivateNetwork: {
    ...mockedOvhPrivateNetwork,
    name: `pn-${region}-${formatDateToDDMMYY(new Date())}`,
  },
});
