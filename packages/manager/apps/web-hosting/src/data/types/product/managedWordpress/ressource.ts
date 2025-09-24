import { ResourceStatus, TaskStatus } from '../../status';
import { Status } from '../ssl';

export type ManagedWordpressResourceType = {
  id: string;
  resourceStatus: ResourceStatus;
  checksum: string;
  iam: {
    displayName: string;
    id: string;
    tags: Record<string, unknown>;
    urn: string;
  };
  currentState: {
    plan: string;
    quotas: {
      websites: {
        planQuota: number;
        additionalQuota: number;
        totalQuota: number;
        totalUsage: number;
      };
      disk: {
        planQuotaBytes: number;
        additionalQuotaBytes: number;
        totalQuotaBytes: number;
        totalUsageBytes: number;
      };
      visits: {
        totalAdditionalQuota: number;
        boosts: {
          initialAmount: number;
          currentAmount: number;
          createdAt: string;
          expiresAt: string;
        }[];
      };
    };
    dashboards: {
      wordPress: string;
    };
    createdAt: string;
  };
  currentTasks: {
    id: string;
    link: string;
    plan: string;
    status: TaskStatus | string;
    type: string;
  }[];
};

export type ManagedWordpressResourceDetailsType = {
  id: string;
  resourceStatus: ResourceStatus;
  checksum: string;
  iam: {
    displayName?: string;
    id: string;
    tags: Record<string, unknown>;
    urn: string;
  } | null;
  currentState: {
    plan: string;
    createdAt: string;
    dashboards: {
      wordPress?: string;
    };
    quotas: {
      disk: {
        additionalQuotaBytes: number;
        planQuotaBytes: number;
        totalQuotaBytes: number;
        totalUsageBytes: number;
      };
      visits: {
        totalAdditionalQuota: number;
        boosts: {
          createdAt: string;
          currentAmount: number;
          expiresAt: string;
          initialAmount: number;
        }[];
      };
      websites: {
        additionalQuota: number;
        planQuota: number;
        totalQuota: number;
        totalUsage: number;
      };
    };
  };
  currentTasks: {
    id: string;
    link: string;
    status: Status;
    type: string;
  }[];
};
