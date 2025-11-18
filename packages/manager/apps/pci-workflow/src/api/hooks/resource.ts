import { TWorkflowResourceId } from '@/api/hooks/workflows';

export const isSameResource = (a: TWorkflowResourceId, b: TWorkflowResourceId): boolean =>
  a.id === b.id && a.region === b.region;
