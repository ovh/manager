import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';
import { TopicAcl } from '@/types/cloud/project/database/kafka';

export const getTopicAcls = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.kafka.TopicAcl[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/acl`,
    createHeaders(NoCacheHeaders, IcebergPaginationHeaders),
  );

export interface AddTopicAcl extends ServiceData {
  topicAcl: Omit<TopicAcl, 'id'>;
}
export const addTopicAcl = async ({
  projectId,
  engine,
  serviceId,
  topicAcl,
}: AddTopicAcl) =>
  apiClient.v6.post<database.kafka.TopicAcl>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/acl`,
    topicAcl,
  );

export interface DeleteTopicAcl extends ServiceData {
  topicAclId: string;
}
export const deleteTopicAcl = async ({
  topicAclId,
  engine,
  projectId,
  serviceId,
}: DeleteTopicAcl) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/acl/${topicAclId}`,
  );
