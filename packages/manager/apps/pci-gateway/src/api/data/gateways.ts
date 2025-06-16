import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosError } from 'axios';
import { TOperation } from '@/api/data/operation';

export type TNewGateway = {
  name: string;
  model: string;
};

export type TGatewayError = {
  class: string;
  message: string;
};

export enum TGatewayErrorClass {
  MaxQuotaReached = 'MaxQuotaReached',
}

export const createGateway = async (
  projectId: string,
  regionName: string,
  networkId: string,
  subnetId: string,
  newGateway: TNewGateway,
) => {
  const url = `/cloud/project/${projectId}/region/${regionName}/network/${networkId}/subnet/${subnetId}/gateway`;

  try {
    const { data } = await v6.post<TOperation>(url, newGateway);

    return data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.response.data;
  }
};

export type TGateway = {
  id: string;
  name: string;
  model: string;
};

export const getGatewayUrl = (
  projectId: string,
  regionName: string,
  gatewayId: string,
) => `/cloud/project/${projectId}/region/${regionName}/gateway/${gatewayId}`;

export const getGateway = async (
  projectId: string,
  regionName: string,
  gatewayId: string,
): Promise<TGateway> => {
  const { data } = await v6.get<TGateway>(
    getGatewayUrl(projectId, regionName, gatewayId),
  );
  return data;
};

export const updateGateway = async (
  projectId: string,
  regionName: string,
  gatewayId: string,
  name: string,
  model: string,
): Promise<TGateway> => {
  const url = `/cloud/project/${projectId}/region/${regionName}/gateway/${gatewayId}`;
  const payload = {
    model,
    name,
  };

  const { data } = await v6.put(url, payload);

  return data;
};
