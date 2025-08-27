import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { HeadersIcebergPagination, ServiceData } from '.';
import { TopicAcl } from '@/types/cloud/project/database/kafka';

export const getTopicAcls = async ({
         projectId,
         engine,
         serviceId,
       }: ServiceData) =>
         apiClient.v6
           .get(
             `/cloud/project/${projectId}/database/${engine}/${serviceId}/acl`,
             {
               headers: HeadersIcebergPagination,
             },
           )
           .then(
             (res: { data: database.kafka.TopicAcl[] }) =>
               res.data as database.kafka.TopicAcl[],
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
         apiClient.v6
           .post(
             `/cloud/project/${projectId}/database/${engine}/${serviceId}/acl`,
             topicAcl,
           )
           .then(
             (res: { data: database.kafka.TopicAcl }) =>
               res.data as database.kafka.TopicAcl,
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
