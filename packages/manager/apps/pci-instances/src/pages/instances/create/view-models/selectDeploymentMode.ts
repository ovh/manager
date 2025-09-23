import queryClient from '@/queryClient';
import { TInstancesCatalog } from '@/types/instance/instancesCatalog.type';
import { TDeploymentMode } from '@/types/instance/common.type';
import InstanceImage from '../../../../../public/assets/instance.png';

import { instancesCatalogQueryKey } from '@/adapters/tanstack-query/store/instances/queryKeys';

export type TDeploymentModeDataForCard = {
  mode: TDeploymentMode;
  title: string;
  description: string;
  url: string;
};

const mapDeploymentModeForCard = (
  mode: TDeploymentMode,
): TDeploymentModeDataForCard => ({
  mode,
  title: `pci_instances_common_instance_${mode}_deployment_mode`,
  description: `pci_instances_common_instance_${mode}_deployment_mode_description`,
  url: InstanceImage,
});

export const selectDeploymentModes = (
  projectId: string,
): TDeploymentModeDataForCard[] => {
  const data = queryClient.getQueryData<TInstancesCatalog>(
    instancesCatalogQueryKey(projectId),
  );

  return (
    data?.entities.deploymentModes.allIds.map(mapDeploymentModeForCard) ?? []
  );
};
