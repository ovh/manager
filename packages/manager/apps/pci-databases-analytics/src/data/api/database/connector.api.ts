import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getConnectors = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.kafkaConnect.Connector[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector`,
    createHeaders(NoCacheHeaders, IcebergPaginationHeaders),
  );

export const getConnector = async ({
  projectId,
  engine,
  serviceId,
  connectorId,
}: ServiceData & { connectorId: string }) =>
  apiClient.v6.get<database.kafkaConnect.Connector>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}`,
    createHeaders(NoCacheHeaders),
  );

export const getConnectorsCapabilities = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.kafkaConnect.capabilities.Connector[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/connector`,
    createHeaders(NoCacheHeaders, IcebergPaginationHeaders),
  );

export interface IServiceWithConnectorCapabilityId extends ServiceData {
  connectorCapabilityId: string;
}
export const getConnectorConfiguration = async ({
  projectId,
  engine,
  serviceId,
  connectorCapabilityId,
}: IServiceWithConnectorCapabilityId) =>
  apiClient.v6.get<
    database.kafkaConnect.capabilities.connector.configuration.Property[]
  >(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/connector/${connectorCapabilityId}/configuration`,
  );

export const getConnectorTransforms = async ({
  projectId,
  engine,
  serviceId,
  connectorCapabilityId,
}: IServiceWithConnectorCapabilityId) =>
  apiClient.v6.get<database.kafkaConnect.capabilities.connector.Transform[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/connector/${connectorCapabilityId}/transforms`,
  );

export interface IAddConnector extends ServiceData {
  connector: Omit<database.kafkaConnect.Connector, 'id' | 'status'>;
}
export const addConnector = async ({
  projectId,
  engine,
  serviceId,
  connector,
}: IAddConnector) =>
  apiClient.v6.post<database.kafkaConnect.Connector>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector`,
    connector,
  );

export interface IEditConnector extends ServiceData {
  connector: database.kafkaConnect.Connector;
}
export const editConnector = async ({
  projectId,
  engine,
  serviceId,
  connector,
}: IEditConnector) =>
  apiClient.v6.put<database.kafkaConnect.Connector>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connector.id}`,
    {
      configuration: connector.configuration,
    },
  );

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
  apiClient.v6.get<database.kafkaConnect.connector.Task[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connector/${connectorId}/task`,
    createHeaders(NoCacheHeaders, IcebergPaginationHeaders),
  );

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
