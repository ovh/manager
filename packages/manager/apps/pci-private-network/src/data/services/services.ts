import { TNetworkCreationData } from '@/types/network.type';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { createPrivateNetwork as apiCreatePrivateNetwork } from '@/data/api/networks';
import { assignGateway, enableSnatOnGateway } from '@/data/api/gateway';
import { fetchCheckPrivateNetworkCreationStatus } from '../hooks/networks/useNetworks';
import queryClient from '@/queryClient';

export const createPrivateNetwork = async (
  values: NewPrivateNetworkForm,
  projectId: string,
) => {
  const {
    existingGatewayId,
    enableSnat,
    isLocalZone,
    region,
    ...networkCreationData
  } = values;
  // exclude gateway and vlanId for LZ
  const { gateway, vlanId, ...param } = networkCreationData;

  // exclude dns param for LZ
  const {
    dnsNameServers,
    useDefaultPublicDNSResolver,
    ...subnetLZ
  } = param.subnet;
  const networkCreationDataLZ = { ...param, subnet: { ...subnetLZ } };
  const data = (isLocalZone
    ? networkCreationDataLZ
    : networkCreationData) as TNetworkCreationData;

  const creation = await apiCreatePrivateNetwork({
    projectId,
    region,
    data,
  });

  const status = await fetchCheckPrivateNetworkCreationStatus(
    projectId,
    creation.id,
  );

  if (!isLocalZone && !!existingGatewayId) {
    if (enableSnat) {
      await enableSnatOnGateway(projectId, region, existingGatewayId);
    }

    await assignGateway(
      projectId,
      region,
      status.resourceId,
      existingGatewayId,
    );
  }
};

export const refreshPrivateNetworkList = (projectId: string) => {
  queryClient.invalidateQueries({
    queryKey: ['project', projectId, 'gateway'],
  });
  queryClient.invalidateQueries({ queryKey: ['subnet', projectId] });
  queryClient.invalidateQueries({
    queryKey: ['aggregated-network', projectId],
  });
};
