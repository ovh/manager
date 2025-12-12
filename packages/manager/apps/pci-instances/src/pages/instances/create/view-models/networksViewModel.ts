import {
  mockedOvhPrivateNetwork,
  mockedPrivateNetworks,
} from '@/__mocks__/instance/constants';
import { format } from 'date-fns';

export const selectPrivateNetworks = (region: string | null) => {
  const name = ['pn', region, format(new Date(), 'ddMMyyyy')]
    .filter(Boolean)
    .join('-');

  return {
    networks: mockedPrivateNetworks,
    ovhPrivateNetwork: {
      ...mockedOvhPrivateNetwork,
      name,
    },
  };
};
