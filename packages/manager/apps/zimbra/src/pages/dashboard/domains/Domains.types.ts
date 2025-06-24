import { ResourceStatus } from '@/data/api';

export type DomainItem = {
  id: string;
  name: string;
  organizationId: string;
  organizationLabel: string;
  account: number;
  status: keyof typeof ResourceStatus;
  cnameToCheck?: string;
};
