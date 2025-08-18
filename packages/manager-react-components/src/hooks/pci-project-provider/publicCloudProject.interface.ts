/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * The hooks will be available in the `@ovh-ux/manager-pci-common` package.
 */

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type TProjectStatus =
  | 'creating'
  | 'deleted'
  | 'deleting'
  | 'ok'
  | 'suspended';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type PublicCloudProject = {
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
