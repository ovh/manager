import { TaskStatus } from '../../status';
import { ResourceStatus, Status } from '../ssl';
import { ManagedWordpressCmsType } from './cms';

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
