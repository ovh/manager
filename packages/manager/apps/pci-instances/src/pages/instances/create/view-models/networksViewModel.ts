import {
  mockedOvhPrivateNetwork,
  mockedPrivateNetworks,
  mockedGatewayConfiguration,
  mockedBasicPublicIpConfiguration,
  mockedFloatingIpConfiguration,
  mockedExistingFloatingIps,
} from '@/__mocks__/instance/constants';
import { format } from 'date-fns';
import { isLocalZone } from '@ovh-ux/muk';

// TODO: does not use isLocalzone muk
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

const getGatewayWarningMessage = (
  hasGateway: boolean,
  isLocalZoneRegion: boolean,
) => {
  if (hasGateway)
    return 'creation:pci_instance_creation_network_gateway_already_assigned_tooltip';

  if (isLocalZoneRegion)
    return 'creation:pci_instance_creation_network_gateway_unavailable_LZ_tooltip';
};

type TNetworkProductConfigView = {
  price: number;
  size: string;
  isDisabled: boolean;
  warningMessage?: string;
};

type TPublicNetworkConfig = {
  gateway: TNetworkProductConfigView;
  basicPublicIp: Omit<TNetworkProductConfigView, 'size'>;
  floatingIp: TNetworkProductConfigView & {
    existingFloatingIps: Array<{ value: string; label: string }>;
  };
};

export const selectPublicNetworkConfig = (
  networkId: string | null,
  microRegion: string | null,
): TPublicNetworkConfig | null => {
  if (!microRegion) return null;

  const network = mockedPrivateNetworks.find(
    (network) => network.value === networkId,
  );

  const hasGateway = !!network?.hasGateway;
  const isLocalZoneRegion = isLocalZone(microRegion);

  return {
    gateway: {
      ...mockedGatewayConfiguration,
      isDisabled: hasGateway || isLocalZoneRegion,
      warningMessage: getGatewayWarningMessage(hasGateway, isLocalZoneRegion),
    },
    basicPublicIp: {
      ...mockedBasicPublicIpConfiguration,
      isDisabled: hasGateway,
    },
    floatingIp: {
      ...mockedFloatingIpConfiguration,
      isDisabled: isLocalZoneRegion,
      existingFloatingIps: mockedExistingFloatingIps,
      ...(isLocalZoneRegion && {
        warningMessage:
          'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_unavailable_LZ_tooltip',
      }),
    },
  };
};
