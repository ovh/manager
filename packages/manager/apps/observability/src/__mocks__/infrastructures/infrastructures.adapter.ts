import {
  getInfrastructures as getInfrastructuresFromMock,
  getRetentions as getRetentionsFromMock,
} from '@/__mocks__/infrastructures/infrastructures.mock';
import { apiConfig } from '@/__mocks__/mock.config';
import {
  getInfrastructures as getInfrastructuresFromApi,
  getRetentions as getRetentionsFromApi,
} from '@/data/api/infrastructures.api';
import { InfrastructuresParams, RetentionParams } from '@/data/api/infrastructures.props';
import { Infrastructure, Retention } from '@/types/infrastructures.type';

export const getInfrastructures = async (
  params: InfrastructuresParams,
): Promise<Infrastructure[]> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getInfrastructures] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getInfrastructuresFromMock(params) : getInfrastructuresFromApi(params);
};

export const getRetentions = async (params: RetentionParams): Promise<Retention[]> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getRetentions] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getRetentionsFromMock(params) : getRetentionsFromApi(params);
};
