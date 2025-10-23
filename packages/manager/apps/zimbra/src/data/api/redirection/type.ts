import { ResourceStatus } from '@/data/api';

export type RedirectionBodyParamsType = {
  source: string;
  destination: string;
};

export type RedirectionType = {
  checksum: string;
  currentState: RedirectionBodyParamsType & {
    createdAt: string;
    domainId: string;
    organizationId: string;
    updatedAt: string;
  };
  currentTasks: {
    id: string;
    link: string;
    status: string;
    type: string;
  }[];
  id: string;
  resourceStatus: keyof typeof ResourceStatus;
  targetSpec: RedirectionBodyParamsType;
};
