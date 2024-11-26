import { TNetworkCreationData, NetworkVisibility } from '@/types/network.type';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import {
  createPrivateNetwork as apiCreatePrivateNetwork,
  getNetwork,
} from '@/data/api/networks';
import { assignGateway, enableSnatOnGateway } from '@/data/api/gateway';
import {
  fetchCheckPrivateNetworkCreationStatus,
  updatePrivateNetworksList,
} from '../hooks/networks/useNetworks';
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

  const { resourceId } = await fetchCheckPrivateNetworkCreationStatus(
    projectId,
    creation.id,
  );

  if (!isLocalZone && !!existingGatewayId) {
    if (enableSnat) {
      await enableSnatOnGateway(projectId, region, existingGatewayId);
    }

    await assignGateway(projectId, region, resourceId, existingGatewayId);
  }

  // had to fetch network to get vlanId if user does not define
  if (!data.vlanId && !isLocalZone) {
    const createdNetwork = await getNetwork(projectId, region, resourceId);
    data.vlanId = createdNetwork.vlanId;
  }

  await updatePrivateNetworksList(projectId, {
    id: resourceId,
    name: data.name,
    region,
    visibility: NetworkVisibility.Private,
    vlanId: data.vlanId,
  });
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
