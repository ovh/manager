import { ResourceStatus } from '@/data/api';

export const AliasTargetType = {
  ACCOUNT: 'ACCOUNT',
  MAILING_LIST: 'MAILING_LIST',
} as const;

export type AliasBodyParamsType = {
  targetId: string;
  alias: string;
};

export type AliasType = {
  checksum: string;
  currentState: {
    alias: {
      domainId: string;
      name: string;
      organizationId: string;
      organizationLabel: string;
    };
    target: {
      domainId: string;
      id: string;
      type: keyof typeof AliasTargetType;
    };
  };
  currentTasks: {
    id: string;
    link: string;
    status: string;
    type: string;
  }[];
  id: string;
  resourceStatus: keyof typeof ResourceStatus;
  targetSpec: AliasBodyParamsType;
};
