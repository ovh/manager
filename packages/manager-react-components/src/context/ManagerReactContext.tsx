import { createContext } from 'react';
import axios, { AxiosInstance } from 'axios';
import {
  IcebergFetchParamsV6,
  IcebergFetchResultV6,
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
} from '../hooks/useCoreApiClient';

export interface IcebergType {
  fetchIcebergV6: <T>(
    params: IcebergFetchParamsV6,
  ) => Promise<IcebergFetchResultV6<T>>;
  fetchIcebergV2: <T>(
    params: IcebergFetchParamsV2,
  ) => Promise<IcebergFetchResultV2<T>>;
}

export interface ManagerReactComponentContextType {
  apiClient: Record<string, AxiosInstance>;
  iceberg: IcebergType;
}

const instance = axios.create({ baseURL: '/' });

export const ManagerReactComponentContext =
  createContext<ManagerReactComponentContextType>({
    apiClient: {
      v6: instance,
      v2: instance,
      aapi: instance,
      ws: instance,
    },
    iceberg: {
      fetchIcebergV6: (params) => undefined,
      fetchIcebergV2: (params) => undefined,
    },
  });

export const ManagerReactComponentProvider = ({
  children,
  apiClient,
  iceberg,
}) => {
  return (
    <ManagerReactComponentContext.Provider value={{ apiClient, iceberg }}>
      {children}
    </ManagerReactComponentContext.Provider>
  );
};
