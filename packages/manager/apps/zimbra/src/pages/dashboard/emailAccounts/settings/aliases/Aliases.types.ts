import { ResourceStatus } from '@/data/api';

export type AliasItem = {
  id: string;
  alias: string;
  status: keyof typeof ResourceStatus;
};
