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
    ...networkCreationParams
  } = values;
  const { gateway, vlanId, ...localZoneData } = networkCreationParams;
  const data = (isLocalZone
    ? localZoneData
    : networkCreationParams) as TNetworkCreationData;

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
