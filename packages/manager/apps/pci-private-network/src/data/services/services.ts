import { UseMutateAsyncFunction } from '@tanstack/react-query';
import {
  TNetworkCreationResponse,
  TNetworkCreationStatusParams,
  TNetworkCreationData,
} from '@/types/network.type';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { createPrivateNetwork } from '@/data/api/networks';
import { assignGateway, enableSnatOnGateway } from '@/data/api/gateway';

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

  const status = await getCreationStatus({
    projectId,
    operationId: creation.id,
  });

  if (!isLocalZone && typeof existingGatewayId === 'string') {
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
