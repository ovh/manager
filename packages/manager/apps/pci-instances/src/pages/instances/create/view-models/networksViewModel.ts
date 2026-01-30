import { TPrivateNetwork } from '@/domain/entities/configuration';
import { getOvhPrivateNetwork } from '@/domain/services/network.service';
import { TNetworkCatalog } from '@/domain/entities/networkCatalog';
import { getRegionalizedGatewayId, getRegionalizedPublicIpId } from '@/utils';
import { TFloatingIp } from '@/domain/entities/configuration';
import { TDeploymentModeID } from '@/domain/entities/instancesCatalog';

type TCapability = 'PublicIP' | 'FloatingIP';

export type TPrivateNetworkData = {
  label: string;
  value: string;
  hasGatewayIp: boolean;
  capabilities: TCapability[];
};

export const selectPrivateNetworks = (region: string | null) => (
  privateNetworks?: TPrivateNetwork,
): TPrivateNetworkData[] => {
  if (!region || !privateNetworks) return [];

  const { networks } = privateNetworks;

  return networks.allIds.flatMap((networkId) => {
    const network = networks.byId.get(networkId);

    if (!network || network.region !== region) return [];

    return network.subnets.map((privateNetworkId) => {
      const subnet = privateNetworks.subnets.byId.get(privateNetworkId);

      return {
        label: network.name,
        value: privateNetworkId,
        hasGatewayIp: !!subnet?.gatewayIp,
        capabilities: subnet?.capabilities ?? [],
      };
    });
  });
};

type TOvhPrivateNetwork = {
  ovhPrivateNetwork: ReturnType<typeof getOvhPrivateNetwork>;
  allocatedVlanIds: number[];
};

export const selectOvhPrivateNetwork = (region: string | null) => (
  privateNetworks?: TPrivateNetwork,
): TOvhPrivateNetwork | null => {
  if (!region || !privateNetworks) return null;

  const { networks } = privateNetworks;

  const allocatedVlanIds = networks.allIds
    .map((networkId) => networks.byId.get(networkId)?.vlanId ?? null)
    .filter((vlanId): vlanId is number => vlanId !== null);

  const ovhPrivateNetwork = getOvhPrivateNetwork(region, privateNetworks);

  return {
    ovhPrivateNetwork,
    allocatedVlanIds,
  };
};

const hasPublicNetworkCapability = (
  privateNetworkId: string,
  privateNetworks: TPrivateNetworkData[],
  capability: 'PublicIP' | 'FloatingIP',
) =>
  !!privateNetworks
    .find((subnet) => subnet.value === privateNetworkId)
    ?.capabilities.includes(capability);

const getPublicIpPrice = (
  networkCatalog: TNetworkCatalog,
  type: 'PublicIP' | 'FloatingIP',
  microRegion: string,
) => {
  const id = getRegionalizedPublicIpId(type, microRegion);
  const publicIp = networkCatalog.publicIp.byId.get(id);

  return publicIp?.price.priceInUcents ?? 0;
};

export const selectSmallGatewayConfig = (microRegion: string | null) => (
  networkCatalog?: TNetworkCatalog,
) => {
  if (!networkCatalog || !microRegion) return null;

  return {
    size: 'S',
    price:
      networkCatalog.gateway.byId.get(
        getRegionalizedGatewayId('s', microRegion),
      )?.price.priceInUcents ?? 0,
  };
};

type TNetworkAvailabilityArgs = {
  privateNetworkId: string | null;
  privateNetworks?: TPrivateNetworkData[];
  deploymentMode?: TDeploymentModeID | null;
};

const isLocalZone = (deploymentMode: TDeploymentModeID) =>
  deploymentMode === 'localzone';

export const getGatewayAvailability = ({
  deploymentMode,
  privateNetworks = [],
  privateNetworkId,
}: TNetworkAvailabilityArgs) => {
  if (!deploymentMode) return null;

  if (
    privateNetworks.find(
      (privateNetwork) => privateNetwork.value === privateNetworkId,
    )?.hasGatewayIp
  )
    return {
      isDisabled: true,
      unavailableReason:
        'creation:pci_instance_creation_network_gateway_already_assigned_tooltip',
    };

  if (isLocalZone(deploymentMode))
    return {
      isDisabled: true,
      unavailableReason:
        'creation:pci_instance_creation_network_gateway_unavailable_LZ_tooltip',
    };

  return {
    isDisabled: false,
    unavailableReason: null,
  };
};

export const selectPublicIpPrices = (microRegion: string | null) => (
  networkCatalog?: TNetworkCatalog,
) => {
  if (!networkCatalog || !microRegion) return null;

  const basicPublicIpPrice = getPublicIpPrice(
    networkCatalog,
    'PublicIP',
    microRegion,
  );

  const floatingIpPrice = getPublicIpPrice(
    networkCatalog,
    'FloatingIP',
    microRegion,
  );

  return {
    basicPublicIp: basicPublicIpPrice,
    floatingIp: floatingIpPrice,
  };
};

export const getPublicIpAvailability = ({
  deploymentMode,
  privateNetworks = [],
  privateNetworkId,
}: TNetworkAvailabilityArgs) => {
  if (!deploymentMode) return null;

  const basicPublicIpIsDisabled = privateNetworkId
    ? !hasPublicNetworkCapability(privateNetworkId, privateNetworks, 'PublicIP')
    : false;

  const isLocalZoneRegion = isLocalZone(deploymentMode);

  const floatingIpIsDisabled = privateNetworkId
    ? !hasPublicNetworkCapability(
        privateNetworkId,
        privateNetworks,
        'FloatingIP',
      )
    : isLocalZoneRegion;

  return {
    basicPublicIp: {
      isDisabled: basicPublicIpIsDisabled,
      unavailableReason: null,
    },
    floatingIp: {
      isDisabled: floatingIpIsDisabled,
      unavailableReason: isLocalZoneRegion
        ? 'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_unavailable_LZ_tooltip'
        : null,
    },
  };
};

export const selectFloatingIps = (floatingIps?: TFloatingIp[]) =>
  floatingIps?.map(({ ip, id }) => ({ label: ip, value: id })) ?? [];
