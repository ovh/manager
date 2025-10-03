import { apiClient } from '@ovh-ux/manager-core-api';

export const getNutanixServerQueryKey = [`get/nutanix/server`];

export type NutanixCluster = {
  targetSpec: { name: string; nodes: { server: string }[] };
};

export const getNutanixServer = async (): Promise<any> => {
  const { data } = await apiClient.v6.get<string[]>(`/nutanix`);
  const clusters = await Promise.all(
    data.map((clusterId) =>
      apiClient.v6
        .get<NutanixCluster>(`/nutanix/${clusterId}`)
        .then(({ data }) => { data?.targetSpec}),
    ),
  );
  return clusters;
};
