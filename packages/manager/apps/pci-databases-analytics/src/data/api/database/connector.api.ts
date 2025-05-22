import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getConnectors = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.kafkaConnect.Connector[]);

export const getConnectorsCapabilities = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/connector`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.kafkaConnect.capabilities.Connector[]);

// export interface AddTopic extends ServiceData {
//   topic: Omit<TopicCreation, 'id'>;
// }
// export const addTopic = async ({
//   projectId,
//   engine,
//   serviceId,
//   topic,
// }: AddTopic) =>
//   apiClient.v6
//     .post(`/cloud/project/${projectId}/database/${engine}/${serviceId}/topic`, {
//       ...topic,
//     })
//     .then((res) => res.data as database.kafka.Topic);

// export interface EditTopic extends ServiceData {
//   topic: database.kafka.Topic;
// }
// export const editTopic = async ({
//   projectId,
//   engine,
//   serviceId,
//   topic,
// }: EditTopic) => {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { id, name, ...body } = topic;
//   return apiClient.v6
//     .put(
//       `/cloud/project/${projectId}/database/${engine}/${serviceId}/topic/${id}`,
//       {
//         ...body,
//       },
//     )
//     .then((res) => res.data as database.kafka.Topic);
// };

// export interface DeleteTopic extends ServiceData {
//   topicId: string;
// }
// export const deleteTopic = async ({
//   topicId,
//   engine,
//   projectId,
//   serviceId,
// }: DeleteTopic) =>
//   apiClient.v6.delete(
//     `/cloud/project/${projectId}/database/${engine}/${serviceId}/topic/${topicId}`,
//   );
