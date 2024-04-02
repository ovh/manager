import { fetchIcebergV6, FilterComparator, v6 } from '@ovh-ux/manager-core-api';
import { ImportsIP } from '@/interface';

export type Filter = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
};

export const getImportsIPs = async (
  projectId: string,
): Promise<ImportsIP[]> => {
  const { data } = await fetchIcebergV6<ImportsIP>({
    route: `/ip?type=failover`,
  });

  const filteredData = data.filter(
    ({ routedTo }) =>
      !routedTo ||
      (typeof routedTo === 'object' && routedTo.serviceName !== projectId),
  );

  return filteredData;
};

export const moveIPToProject = async (ipEncoded: string, projectId: string) => {
  const { data } = await v6.post(`/ip/${ipEncoded}/move`, {
    to: projectId,
  });

  return data;
};

export default { getImportsIPs };
