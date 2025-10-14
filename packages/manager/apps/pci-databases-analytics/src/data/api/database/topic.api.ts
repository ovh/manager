import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';
import { TopicCreation } from '@/types/cloud/project/database/kafka';

export const getTopics = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.kafka.Topic[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/topic`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export interface AddTopic extends ServiceData {
  topic: Omit<TopicCreation, 'id'>;
}
export const addTopic = async ({
  projectId,
  engine,
  serviceId,
  topic,
}: AddTopic) =>
  apiClient.v6.post<database.kafka.Topic>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/topic`,
    topic,
  );

export interface EditTopic extends ServiceData {
  topic: database.kafka.Topic;
}
export const editTopic = async ({
  projectId,
  engine,
  serviceId,
  topic,
}: EditTopic) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, name, ...body } = topic;
  return apiClient.v6.put<database.kafka.Topic>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/topic/${id}`,
    body,
  );
};

export interface DeleteTopic extends ServiceData {
  topicId: string;
}
export const deleteTopic = async ({
  topicId,
  engine,
  projectId,
  serviceId,
}: DeleteTopic) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/topic/${topicId}`,
  );
