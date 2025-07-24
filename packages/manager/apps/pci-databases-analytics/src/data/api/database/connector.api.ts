import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { HeadersNoCache, HeadersIcebergPagination, ServiceData } from '.';

export const getConnectors = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get<database.kafkaConnect.Connector[]>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector`,
      {
        headers: HeadersIcebergPagination,
      },
    )
    .then((res) => res.data);

export const getConnector = async ({
  projectId,
  engine,
  serviceId,
  connectorId,
}: ServiceData & { connectorId: string }) =>
  apiClient.v6
    .get<database.kafkaConnect.Connector>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}`,
      {
        headers: HeadersNoCache,
      },
    )
    .then((res) => res.data);

export const getConnectorsCapabilities = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get<database.kafkaConnect.capabilities.Connector[]>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/connector`,
      {
        headers: HeadersIcebergPagination,
      },
    )
    .then((res) => res.data);

export interface IServiceWithConnectorCapabilityId extends ServiceData {
  connectorCapabilityId: string;
}
export const getConnectorConfiguration = async ({
  projectId,
  engine,
  serviceId,
  connectorCapabilityId,
}: IServiceWithConnectorCapabilityId) =>
  apiClient.v6
    .get<database.kafkaConnect.capabilities.connector.configuration.Property[]>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/connector/${connectorCapabilityId}/configuration`,
    )
    .then((res) => res.data);

export const getConnectorTransforms = async ({
  projectId,
  engine,
  serviceId,
  connectorCapabilityId,
}: IServiceWithConnectorCapabilityId) =>
  apiClient.v6
    .get<database.kafkaConnect.capabilities.connector.Transform[]>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/connector/${connectorCapabilityId}/transforms`,
    )
    .then((res) => res.data);

export interface IAddConnector extends ServiceData {
  connector: Omit<database.kafkaConnect.Connector, 'id' | 'status'>;
}
export const addConnector = async ({
  projectId,
  engine,
  serviceId,
  connector,
}: IAddConnector) =>
  apiClient.v6
    .post<database.kafkaConnect.Connector>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector`,
      connector,
    )
    .then((res) => res.data);

export interface IEditConnector extends ServiceData {
  connector: database.kafkaConnect.Connector;
}
export const editConnector = async ({
  projectId,
  engine,
  serviceId,
  connector,
}: IEditConnector) =>
  apiClient.v6
    .put<database.kafkaConnect.Connector>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connector.id}`,
      {
        configuration: connector.configuration,
      },
    )
    .then((res) => res.data);

export interface IOperationConnector extends ServiceData {
  connectorId: string;
}
export const deleteConnector = async ({
  projectId,
  engine,
  serviceId,
  connectorId,
}: IOperationConnector) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}`,
  );

export const pauseConnector = async ({
  projectId,
  engine,
  serviceId,
  connectorId,
}: IOperationConnector) =>
  apiClient.v6.post(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}/pause`,
  );

export const resumeConnector = async ({
  projectId,
  engine,
  serviceId,
  connectorId,
}: IOperationConnector) =>
  apiClient.v6.post(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}/resume`,
  );

export const restartConnector = async ({
  projectId,
  engine,
  serviceId,
  connectorId,
}: IOperationConnector) =>
  apiClient.v6.post(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}/restart`,
  );

export const getConnectorTasks = async ({
  projectId,
  engine,
  serviceId,
  connectorId,
}: IOperationConnector) =>
  apiClient.v6
    .get<database.kafkaConnect.connector.Task[]>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}/task`,
      {
        headers: HeadersIcebergPagination,
      },
    )
    .then((res) => res.data);

export interface IRestartTask extends ServiceData {
  connectorId: string;
  taskId: string;
}
export const restartTask = async ({
  projectId,
  engine,
  serviceId,
  connectorId,
  taskId,
}: IRestartTask) =>
  apiClient.v6.post<database.kafkaConnect.connector.Task[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}/task/${taskId}/restart`,
  );
