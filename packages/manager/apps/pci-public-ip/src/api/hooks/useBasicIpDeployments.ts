import { useMemo } from 'react';
import {
  TDeployment,
  useFeaturedDeploymentModes,
} from '@ovh-ux/manager-pci-common';
import { useBasicIpCatalog } from '@/api/hooks/useBasicIpCatalog';

export const useBasicIpDeployments = (projectId: string) => {
  const { deployments: deploymentModes } = useFeaturedDeploymentModes();
  const { regions, getRegionPrice } = useBasicIpCatalog(projectId);

  return useMemo<TDeployment[]>(
    () =>
      deploymentModes
        .filter(({ name }) => regions.some(({ type }) => type === name))
        .map((deployment) => {
          const deploymentPrices = regions
            .filter(({ type }) => type === deployment.name)
            .map(({ name }) => getRegionPrice(name));

          return {
            ...deployment,
            price: Math.min(...deploymentPrices),
          };
        }),
    [deploymentModes, regions, getRegionPrice],
  );
};
