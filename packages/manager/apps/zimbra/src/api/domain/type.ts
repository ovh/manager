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
    status: string;
    updatedAt: string;
    accountsStatistics: AccountStatistics[];
    expectedDNSConfig: {
      mx: Array<{
        priority: number;
        target: string;
      }>;
      ownership: {
        cname: string | null;
      };
    };
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
