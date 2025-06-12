import { TProject } from '@ovh-ux/manager-pci-common';
import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';

export const getProjects = async (): Promise<FetchResultV6<TProject>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };
  return v6.get(`/cloud/project`, { headers });
};
