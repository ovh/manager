import { UseMutateAsyncFunction } from '@tanstack/react-query';
import {
  TNetworkCreationResponse,
  TNetworkCreationStatusParams,
  TNetworkCreationData,
  NetworkVisibility,
} from '@/types/network.type';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { createPrivateNetwork, getNetwork } from '@/data/api/networks';
import { assignGateway, enableSnatOnGateway } from '@/data/api/gateway';
import { setOptimisticPrivateNetworks } from '../hooks/networks/useNetworks';

type GetCreationStatus = UseMutateAsyncFunction<
  TNetworkCreationResponse,
  Error,
  TNetworkCreationStatusParams,
  unknown
>;

export const handleCreatePrivateNetwork = async (
  values: NewPrivateNetworkForm,
  projectId: string,
  getCreationStatus: GetCreationStatus,
) => {
  const {
    defaultVlanId,
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

  const creation = await createPrivateNetwork({
    projectId,
    region,
    data,
  });

  const { resourceId } = await getCreationStatus({
    projectId,
    operationId: creation.id,
  });

  if (!isLocalZone && typeof existingGatewayId === 'string') {
    if (enableSnat) {
      await enableSnatOnGateway(projectId, region, existingGatewayId);
    }

    await assignGateway(projectId, region, resourceId, existingGatewayId);
  }

  let createdVlanId = data.vlanId || null;

  if (!createdVlanId && !isLocalZone) {
    const createdNetwork = await getNetwork(projectId, region, resourceId);
    createdVlanId = createdNetwork.vlanId;
  }

  await setOptimisticPrivateNetworks(projectId, {
    id: resourceId,
    name: data.name,
    region,
    visibility: NetworkVisibility.Private,
    vlanId: createdVlanId,
  });
};
