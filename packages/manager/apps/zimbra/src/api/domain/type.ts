import { AccountStatistics, ResourceStatus } from '../api.type';

export type DomainBodyParamsType = {
  authoritative?: boolean;
  organizationId?: string;
  name?: string;
};

export type DomainType = {
  checksum: string;
  currentState: {
    authoritative: boolean;
    cnameToCheck: string;
    createdAt: string;
    name: string;
    organizationId: string;
    organizationLabel: string;
    status: keyof typeof ResourceStatus;
    updatedAt: string;
    accountsStatistics: AccountStatistics[];
  };
  currentTasks: Array<{
    id: string;
    link: string;
    status?: keyof typeof ResourceStatus;
    type: string;
  }>;
  id: string;
  resourceStatus: keyof typeof ResourceStatus;
  targetSpec: {
    authoritative: boolean;
    cnameToCheck: string;
    createdAt: string;
    name: string;
    organizationId: string;
    organizationLabel: string;
    status: keyof typeof ResourceStatus;
    updatedAt: string;
    accountsStatistics: AccountStatistics[];
  };
};
