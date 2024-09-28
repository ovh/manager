import { createContext, Context } from 'react';
import axios, { AxiosInstance } from 'axios';
import { Region } from './environment';
import { Environment } from './environment/environment';
import exposeApi from './api';
import {
  IcebergFetchParamsV6,
  IcebergFetchResultV6,
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
} from '../hooks/useCoreApiClient';

export type ShellClientApi = ReturnType<typeof exposeApi>;

export interface TrackingConfig {
  config: {
    level1?: string;
    level2: string;
    level3?: string;
    level4?: string;
    level5?: string;
  };
}

export type RegionsTrackingConfig = {
  [region in Region]: TrackingConfig;
};

export type TrackingContextParams = {
  chapter1?: string;
  chapter2?: string;
  chapter3?: string;
  pageTheme?: string;
  level2?: string;
  appName?: string;
  level2Config?: RegionsTrackingConfig;
};

export type ShellContextType = {
  shell: ShellClientApi;
  environment: Environment;
  tracking?: TrackingContextParams;
};

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
  shellContext: Context<ShellContextType>;
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
      fetchIcebergV6: () => undefined,
      fetchIcebergV2: () => undefined,
    },
    shellContext: createContext<ShellContextType>({
      shell: null,
      environment: null,
      tracking: null,
    }),
  });

export const ManagerReactComponentsProvider = ({
  children,
  apiClient,
  iceberg,
  shellContext,
}) => {
  return (
    <ManagerReactComponentContext.Provider
      value={{ apiClient, iceberg, shellContext }}
    >
      {children}
    </ManagerReactComponentContext.Provider>
  );
};
