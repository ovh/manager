import { ResourceStatus } from '../api.type';

export type AliasType = {
  checksum: string;
  currentState: {
    alias: string;
    aliasTarget: string;
    organizationId: string;
    organizationLabel: string;
  };
  currentTasks: {
    id: string;
    link: string;
    status: string;
    type: string;
  }[];
  id: string;
  resourceStatus: keyof typeof ResourceStatus;
  targetSpec: {
    alias: string;
    aliasTarget: string;
    organizationId: string;
    organizationLabel: string;
  };
};
