import { ResourceStatus } from '@/data/api';

export type RedirectionItem = {
  id: string;
  from: string;
  to: string;
  organization: string;
  status: keyof typeof ResourceStatus;
};
