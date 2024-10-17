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
  resourceStatus: ResourceStatus;
  targetSpec: {
    alias: string;
    aliasTarget: string;
    organizationId: string;
    organizationLabel: string;
  };
};

export type AliasBodyParamsType = {
  organizationId?: string;
  aliasTarget?: string;
  alias?: string;
};
