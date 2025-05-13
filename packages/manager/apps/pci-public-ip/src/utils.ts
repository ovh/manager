import { Network } from './interface';

export const getPrivateNetworkIdFromGateway = (
  privateNetworks: Network[],
  gatewayId: string,
): string => {
  const network = privateNetworks?.find((privateNetwork) =>
    privateNetwork.regions?.find(
      ({ openstackId }) => openstackId === gatewayId,
    ),
  );
  return network?.id || '';
};
