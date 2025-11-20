// Type definitions from @ovh-ux/manager-pci-common
// These are re-exported here to satisfy the linter

export type TProjectStatus = 'creating' | 'deleted' | 'deleting' | 'ok' | 'suspended';

export type TProject = {
  access: 'full' | 'restricted';
  creationDate: string;
  description?: string;
  expiration?: string | null;
  iam: {
    displayName?: string;
    id: string;
    tags?: Record<string, string>;
    urn: string;
  };
  manualQuota: boolean;
  orderId: number | null;
  planCode: string;
  projectName: string | null;
  project_id: string;
  status: TProjectStatus;
  unleash: boolean;
};

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}
