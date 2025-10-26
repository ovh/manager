import { InfrastructureType, InfrastructureUsage } from '@/types/infrastructures.type';

export type InfrastructuresParams = {
  resourceName: string;
  usages?: InfrastructureUsage;
  types?: InfrastructureType;
  signal?: AbortSignal;
};

export type RetentionParams = {
  resourceName: string;
  infrastructureId: string;
  signal?: AbortSignal;
};
