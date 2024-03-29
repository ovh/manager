import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';
import { ServiceData } from '.';

export interface AddNodeProps extends ServiceData {
  node: database.service.NodeCreation;
}
export const addNode = async ({
  projectId,
  engine,
  serviceId,
  node,
}: AddNodeProps) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/node`,
      node,
    )
    .then((res) => res.data as database.service.Node);

export interface DeleteNodeProps extends ServiceData {
  nodeId: string;
}
export const deleteNode = async ({
  projectId,
  engine,
  serviceId,
  nodeId,
}: DeleteNodeProps) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/node/${nodeId}`,
  );
