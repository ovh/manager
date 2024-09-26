import { AccountStatistics, ResourceStatus } from '../api.type';

export type DomainBodyParamsType = {
  organizationId?: string;
  name?: string;
};

export type DomainType = {
  checksum: string;
  currentState: {
    cnameToCheck: string;
    createdAt: string;
    name: string;
    organizationId: string;
    organizationLabel: string;
    status: ResourceStatus;
    updatedAt: string;
    accountsStatistics: AccountStatistics[];
  };
  currentTasks: Array<{
    id: string;
    link: string;
    status?: ResourceStatus;
    type: string;
  }>;
  id: string;
  resourceStatus: ResourceStatus;
  targetSpec: {
    organizationId: string;
  };
};
