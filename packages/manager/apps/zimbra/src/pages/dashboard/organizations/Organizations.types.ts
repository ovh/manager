import { ResourceStatus } from '@/data/api';

export type OrganizationItem = {
  id: string;
  name: string;
  label: string;
  account: number;
  status: keyof typeof ResourceStatus;
};
