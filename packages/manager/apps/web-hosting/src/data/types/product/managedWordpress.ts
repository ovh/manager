/* eslint-disable max-lines */
import { ResourceStatus, TaskStatus } from '../status';
import { Status } from './ssl';

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
export enum ManagedWordpressCmsType {
  WORDPRESS = 'WORDPRESS',
}
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

export type PostImportPayload = {
  adminLogin: string;
  adminPassword: string;
  adminURL?: string;
  cms: ManagedWordpressCmsType.WORDPRESS;
  cmsSpecific?: {
    wordPress?: {
      language?: string;
      url?: string;
    };
  };
};
export type PostImportTaskPayload = {
  'import.cmsSpecific.wordpress.selection': {
    plugins: { name: string; version: string; enabled: boolean }[];
    themes: { name: string; version: string; active: boolean }[];
    wholeDatabase: boolean;
    media: boolean;
    posts: boolean;
    pages: boolean;
    comments: boolean;
    tags: boolean;
    users: boolean;
  };
};

export type ManagedWordpressWebsiteDetails = {
  id: string;
  checksum: string;
  iam?: {
    displayName: string;
    id: string;
    tags: Record<string, unknown>;
    urn: string;
  };
  currentState: {
    cms: ManagedWordpressCmsType;
    createdAt: string;
    defaultFQDN: string;
    diskUsageBytes: number;
    import?: {
      checkResult: {
        cmsSpecific: {
          wordPress: {
            plugins: {
              enabled: boolean;
              name: string;
              version: string;
            }[];
            themes: {
              active: boolean;
              name: string;
              version: string;
            }[];
          };
        };
      };
    };
    phpVersion: string;
    serviceId: string;
  };
  currentTasks: {
    id: string;
    link: string;
    status: Status;
    type: string;
  }[];
  resourceStatus: ResourceStatus;
  targetSpec?: {
    creation?: {
      adminLogin: string;
      cms: ManagedWordpressCmsType;
      adminPassword?: string;
      cmsSpecific?: {
        wordPress?: {
          language?: string;
          url?: string;
        };
      };
      phpVersion?: string;
    };
    import?: {
      adminLogin: string;
      adminPassword?: string;
      adminURL: string;
      cms: ManagedWordpressCmsType;
      cmsSpecific?: {
        wordPress?: {
          selection?: {
            comments?: boolean;
            media?: boolean;
            pages?: boolean;
            plugins?: {
              enabled: boolean;
              name: string;
              version: string;
            }[];
            posts?: boolean;
            tags?: boolean;
            themes?: {
              active: boolean;
              name: string;
              version: string;
            }[];
            users?: boolean;
            wholeDatabase: boolean;
          };
        };
      };
    };
  };
};
export type ManagedWordpressWebsites = {
  id: string;
  checksum: string;
  currentState: {
    cms?: ManagedWordpressCmsType;
    createdAt: string;
    defaultFQDN?: string;
    diskUsageBytes: number;
    import: {
      checkResult: {
        cmsSpecific: {
          wordPress: {
            plugins: {
              enabled: boolean;
              name: string;
              version: string;
            }[];
            themes: {
              active: boolean;
              name: string;
              version: string;
            }[];
          };
        };
      };
    };
    phpVersion: string;
    id: string;
  };
  currentTasks: {
    id: string;
    link: string;
    status: TaskStatus;
    type: string;
  }[];
  iam: {
    displayName?: string;
    id: string;
    tags?: Record<string, string>;
    urn: string;
  };
  resourceStatus: ResourceStatus;
  targetSpec?: {
    creation?: {
      adminLogin: string;
      cms: ManagedWordpressCmsType;
      adminPassword?: string;
      cmsSpecific?: {
        wordPress?: {
          language?: string;
          url?: string;
        };
      };
      phpVersion?: string;
    };
    import?: {
      adminLogin: string;
      adminPassword?: string;
      adminURL: string;
      cms: ManagedWordpressCmsType;
      cmsSpecific?: {
        wordPress?: {
          selection?: {
            comments?: boolean;
            media?: boolean;
            pages?: boolean;
            plugins?: {
              enabled: boolean;
              name: string;
              version: string;
            }[];
            posts?: boolean;
            tags?: boolean;
            themes?: {
              active: boolean;
              name: string;
              version: string;
            }[];
            users?: boolean;
            wholeDatabase: boolean;
          };
        };
      };
    };
  };
};

export type ManagedWordpressResourceTask = {
  createdAt: string;
  errors: Array<{
    message: string;
  }>;
  finishedAt?: string;
  id: string;
  link: string;
  message: string;
  progress: Array<{
    name: string;
    status: Status;
  }>;
  startedAt: string | null;
  status: Status;
  type: string;
  updatedAt: string;
};
