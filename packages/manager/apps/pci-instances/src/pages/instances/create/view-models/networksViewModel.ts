import {
  mockedOvhPrivateNetwork,
  mockedPrivateNetworks,
  mockedGatewayConfiguration,
} from '@/__mocks__/instance/constants';
import { format } from 'date-fns';
import { isLocalZone } from '@ovh-ux/muk';

// TODO: extract ovhPrivateNetwork
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

export const selectGatewayConfiguration = (
  networkId: string | null,
  microRegion: string | null,
) => {
  if (!microRegion) return null;

  const network = mockedPrivateNetworks.find(
    (network) => network.value === networkId,
  );

  return {
    ...mockedGatewayConfiguration,
    isDisabled: network?.hasGateway || isLocalZone(microRegion),
  };
};
