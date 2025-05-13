import { useMemo, useContext } from 'react';
import {
  TDeployment,
  useFeaturedDeploymentModes,
} from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useAddons } from '../useAddons/useAddons';
import { FLOATING_IP_ADDON_FAMILY } from '../useAddons/useAddons.constant';
import { sortProductByPrice } from '../useAddons/useAddons.select';

export const useDeployments = (projectId: string) => {
  const { deployments: deploymentModes } = useFeaturedDeploymentModes();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { addons } = useAddons({
    ovhSubsidiary,
    projectId,
    addonFamily: FLOATING_IP_ADDON_FAMILY,
    select: sortProductByPrice,
  });

  const deployments = useMemo<TDeployment[]>(
    () =>
      deploymentModes.filter(({ name }) =>
        addons.some(({ regions }) => regions.some(({ type }) => type === name)),
      ),
    [deploymentModes, addons],
  );

  return useMemo(
    () =>
      deployments.map((deployment) => {
        const price =
          addons.find((addon) =>
            addon.regions.find(({ type }) => type === deployment.name),
          )?.price || null;

        return {
          ...deployment,
          price,
        };
      }),
    [deployments, addons],
  );
};
