import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosError, isAxiosError } from 'axios';
import { TOperation } from '@/api/data/operation';

export type TNewGateway = {
  name: string;
  model: string;
};

export enum TGatewayErrorClass {
  MaxQuotaReached = 'MaxQuotaReached',
}
type CustomApiError = {
  class: string;
  message: string;
};

export const isApiErrorResponse = (
  error: unknown,
): error is AxiosError<CustomApiError> => {
  const err = error as AxiosError<CustomApiError>;
  const data = err.response?.data;

  return (
    isAxiosError(err) &&
    data?.message !== undefined &&
    data?.class !== undefined
  );
};

export const createGateway = async (
  projectId: string,
  regionName: string,
  networkId: string,
  subnetId: string,
  newGateway: TNewGateway,
) => {
  const url = `/cloud/project/${projectId}/region/${regionName}/network/${networkId}/subnet/${subnetId}/gateway`;

  const { data } = await v6.post<TOperation>(url, newGateway);
  return data;
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
