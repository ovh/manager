import { apiClient } from '@ovh-ux/manager-core-api';

export const getNutanixServerQueryKey = [`get/nutanix/server`];

type NutanixCluster = {
  targetSpec: { name: string; nodes: { server: string }[] };
};

export const getNutanixServer = async (): Promise<NutanixCluster[]> => {
  const { data: nutanixCluster } = await apiClient.v6.get<string[]>(`/nutanix`);
  const clusters = await Promise.all(
    nutanixCluster.map((clusterId) =>
      apiClient.v6
        .get<NutanixCluster>(`/nutanix/${clusterId}`)
        .then(({ data }) => {
          return data;
        }),
    ),
  );

  return clusters;
};
