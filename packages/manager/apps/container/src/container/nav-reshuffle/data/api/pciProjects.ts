import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { PciProject } from '@/container/nav-reshuffle/sidebar/ProjectSelector/PciProject';

export const getPciProjects = async () => {
  const response = await fetchIcebergV6<PciProject>({
    route: '/cloud/project',
    sortBy: 'description',
  });
  return response.data;
};
