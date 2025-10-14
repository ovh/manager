import { apiClient } from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export interface AddNode extends ServiceData {
  node: Partial<database.service.NodeCreation>;
}
export const addNode = async ({
  projectId,
  engine,
  serviceId,
  node,
}: AddNode) =>
  apiClient.v6.post<database.service.Node>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/node`,
    node,
  );

export interface DeleteNode extends ServiceData {
  nodeId: string;
}
export const deleteNode = async ({
  projectId,
  engine,
  serviceId,
  nodeId,
}: DeleteNode) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/node/${nodeId}`,
  );
