import { AccountStatistics, ResourceStatus } from '@/data/api';

export type ZimbraPlatformType = {
  id: string;
  resourceStatus: keyof typeof ResourceStatus;
  checksum: string;
  targetSpec: {
    name: string;
    description: string;
  };
  currentState: {
    name: string;
    description: string;
    numberOfOrganizations: number;
    accountsStatistics: AccountStatistics[];
    quota: number;
  };
  currentTasks: Array<{
    id: string;
    type: string;
    link: string;
  }>;
  iam: {
    id: string;
    urn: string;
  };
};
