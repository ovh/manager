import { ResourceStatus } from '@/data/api';

export type RedirectionItem = {
  id: string;
  from: string;
  to: string;
  organizationLabel: string;
  status: keyof typeof ResourceStatus;
  organizationId: string;
};
