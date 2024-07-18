import { AccountStatistics } from '../api.type';

export type OrganizationType = {
  id: string;
  resourceStatus: string;
  checksum: string;
  targetSpec: {
    name: string;
    description: string;
    label: string;
    storageConsumed: number;
    updatedAt: string;
    createdAt: string;
    accountsStatistics: AccountStatistics[];
  };
  currentState: {
    name: string;
    description: string;
    label: string;
    storageConsumed: number;
    updatedAt: string;
    createdAt: string;
    accountsStatistics: AccountStatistics[];
  };
  currentTasks: Array<{
    id: string;
    link: string;
    status: string;
    type: string;
  }>;
};

export type OrganizationBodyParamsType = {
  description?: string;
  label?: string;
  name?: string;
};
