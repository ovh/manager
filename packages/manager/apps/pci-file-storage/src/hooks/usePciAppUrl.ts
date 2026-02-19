import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import { useProjectId } from './useProjectId';

export enum PciAppUrlSuffix {
  PrivateNetworks = 'private-networks',
}

export const usePciAppUrl = (suffix: PciAppUrlSuffix) => {
  const projectId = useProjectId();
  const { data: url } = useNavigationGetUrl([
    'public-cloud',
    `#/pci/projects/${projectId}/${suffix}`,
    {},
  ]);

  return url;
};
