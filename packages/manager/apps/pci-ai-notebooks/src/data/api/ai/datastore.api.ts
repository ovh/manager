import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';
import { PCIAi } from '..';

interface DatastoresProps extends PCIAi {
  region: string;
}

export const getDatastores = async ({ projectId, region }: DatastoresProps) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/data/region/${region}/alias`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.DataStore[]);

export interface DatastoreProps extends DatastoresProps {
  alias: string;
}

export const getDatastore = async ({
  projectId,
  region,
  alias,
}: DatastoreProps) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}`)
    .then((res) => res.data as ai.DataStore);

export interface AddDatastoreProps extends PCIAi {
  region: string;
  datastore: ai.DataStoreInput;
}
export const addDatastore = async ({
  projectId,
  region,
  datastore,
}: AddDatastoreProps) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/ai/data/region/${region}/alias`,
      datastore,
    )
    .then((res) => res.data as ai.DataStore);

export interface EditDatastoreProps extends AddDatastoreProps {
  alias: string;
}
export const editDatastore = async ({
  projectId,
  region,
  alias,
  datastore,
}: EditDatastoreProps) =>
  apiClient.v6
    .put(
      `/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}`,
      datastore,
    )
    .then((res) => res.data as ai.DataStore);

export const deleteDatastore = async ({
  projectId,
  region,
  alias,
}: DatastoreProps) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}`,
  );

export const getDatastoreAuth = async ({
  projectId,
  region,
  alias,
}: DatastoreProps) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}/auth`,
    )
    .then((res) => res.data as ai.DataStoreAuth);

export const getDatastoreContainer = async ({
  projectId,
  region,
  alias,
}: DatastoreProps) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}/containers`,
    )
    .then((res) => res.data);
