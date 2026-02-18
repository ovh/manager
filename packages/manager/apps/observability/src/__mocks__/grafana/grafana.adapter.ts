import {
  createGrafana as createGrafanaFromMock,
  deleteGrafana as deleteGrafanaFromMock,
  getGrafana as getGrafanaFromMock,
  getGrafanaReleases as getGrafanaReleasesFromMock,
  getGrafanas as getGrafanasFromMock,
} from '@/__mocks__/grafana/grafana.mock';
import { apiConfig } from '@/__mocks__/mock.config';
import mockLogger from '@/__mocks__/mock.logger';
import {
  createGrafana as createGrafanaFromApi,
  deleteGrafana as deleteGrafanaFromApi,
  getGrafana as getGrafanaFromApi,
  getGrafanaReleases as getGrafanaReleasesFromApi,
  getGrafanas as getGrafanasFromApi,
} from '@/data/api/grafana.api';
import {
  CreateGrafanaPayload,
  GetGrafanaPayload,
  GetGrafanaReleasesParams,
} from '@/data/api/grafana.props';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { Grafana, GrafanaReleasesResponse } from '@/types/managedDashboards.type';

export const getGrafanas = async (params: ObservabilityServiceParams): Promise<Grafana[]> => {
  const isMockEnabled = apiConfig.grafana === 'mock';
  mockLogger.info('[getGrafanas] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getGrafanasFromMock(params) : getGrafanasFromApi(params);
};

export const getGrafana = async (params: GetGrafanaPayload): Promise<Grafana> => {
  const isMockEnabled = apiConfig.grafana === 'mock';
  mockLogger.info('[getGrafana] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getGrafanaFromMock(params) : getGrafanaFromApi(params);
};

export const getGrafanaReleases = async (
  params: GetGrafanaReleasesParams,
): Promise<GrafanaReleasesResponse> => {
  const isMockEnabled = apiConfig.grafana === 'mock';
  mockLogger.info('[getGrafanaReleases] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getGrafanaReleasesFromMock(params) : getGrafanaReleasesFromApi(params);
};

export const createGrafana = async (payload: CreateGrafanaPayload): Promise<Grafana> => {
  const isMockEnabled = apiConfig.grafana === 'mock';
  mockLogger.info('[createGrafana] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? createGrafanaFromMock(payload) : createGrafanaFromApi(payload);
};

export const deleteGrafana = async (params: GetGrafanaPayload): Promise<Grafana> => {
  const isMockEnabled = apiConfig.grafana === 'mock';
  mockLogger.info('[deleteGrafana] Mock enabled ->', isMockEnabled);
  return isMockEnabled ? deleteGrafanaFromMock(params) : deleteGrafanaFromApi(params);
};
