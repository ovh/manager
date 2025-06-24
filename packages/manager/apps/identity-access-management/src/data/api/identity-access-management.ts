import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type GetiamResourceListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': string;
  /** Pagination size */
  'X-Pagination-Size': number;
  /** Filter resources for specific resource names */
  resourceName: string;
  /** Filter resources for specific resource types */
  resourceType: IamResourceType;
  /** Filter resources for specific resource URN patterns */
  resourceURN: string;
  /** Filter resources using tag filters */
  tags: Record<string, Array<{ operator: IamTagsOperatorEnum; value: string }>>;
};

export type IamTagsOperatorEnum = {
  EQ: 'EQ';
  EXISTS: 'EXISTS';
  ILIKE: 'ILIKE';
  LIKE: 'LIKE';
  NEQ: 'NEQ';
  NEXISTS: 'NEXISTS';
};

export type IamResourceType =
  | 'overTheBoxHardware'
  | 'pccVMware'
  | 'sharepoint'
  | 'vps'
  | 'xdslEmail'
  | 'zimbraPlatform/account'
  | 'horizonView'
  | 'ldp/stream'
  | 'licenseSqlServer'
  | 'partner'
  | 'pccVMware/sapPreInstallation'
  | 'sdwan'
  | 'sms'
  | 'stackMis'
  | 'domain'
  | 'webPaaS'
  | 'supportVIP'
  | 'emailDomain'
  | 'hostingOption'
  | 'licenseHycu'
  | 'microsoftServices'
  | 'ovhCloudConnect'
  | 'dedicatedServer'
  | 'housing'
  | 'licenseOfficePrepaid'
  | 'licenseVirtuozzo'
  | 'licenseWorklight'
  | 'nas'
  | 'okms/serviceKey'
  | 'veeamEnterprise'
  | 'dedicatedCeph'
  | 'voip'
  | 'voipPhoneSpare'
  | 'zimbraPlatform'
  | 'vmwareCloudDirector'
  | 'clusterDelivery'
  | 'freefax'
  | 'mxplanAccount'
  | 'okms/secret'
  | 'publicCloudProject/managedRegistry'
  | 'ssl'
  | 'vpsAdditionalDisk'
  | 'cdn'
  | 'cloudDB'
  | 'contact'
  | 'packSipTrunk'
  | 'webHosting'
  | 'alldom'
  | 'ipService'
  | 'ldp/index'
  | 'licenseDirectAdmin'
  | 'veeamCloudConnect'
  | 'zimbraPlatform/organization'
  | 'dockerRegistry'
  | 'dedicatedServerIronic'
  | 'voipTrunk'
  | 'vrack'
  | 'xdsl'
  | 'dedicatedNVMeoF'
  | 'ldp/tenant'
  | 'loadbalancer'
  | 'nasHA'
  | 'pccServicePack'
  | 'publicCloudProject'
  | 'account'
  | 'webCloudDatabases'
  | 'ldp/dashboard'
  | 'ldp/osd'
  | 'licenseOffice'
  | 'licenseRedHat'
  | 'okms'
  | 'voipLine'
  | 'xdslSpare'
  | 'hadoopClusterAccount'
  | 'licenseCpanel'
  | 'packXdsl'
  | 'emailMxplan'
  | 'licenseCloudLinux'
  | 'voipSmsvn'
  | 'ipUnshielded'
  | 'cspReseller'
  | 'dnsZone'
  | 'ip'
  | 'licensePlesk'
  | 'okms/kmip'
  | 'vmwareCloudDirector/virtualDataCenter'
  | 'billingAccount'
  | 'ldp'
  | 'ldp/alias'
  | 'legacyVrack'
  | 'licenseWindows'
  | 'nutanix'
  | 'pccManagementFee'
  | 'sslGateway'
  | 'emailPro'
  | 'voipAlias'
  | 'vrackServices'
  | 'storageNetApp'
  | 'overTheBox'
  | 'vmwareCloudDirectorBackup'
  | 'metrics';

export type IamResource = {
  displayName: string;
  id: string;
  name: string;
  owner: string;
  tags: Record<string, string>;
  type: IamResourceType;
  urn: string;
};

export const getiamResourceListQueryKey = ['get/iam/resource'];

/**
 *  : List all resources
 */
export const getiamResourceList = async (
  params: GetiamResourceListParams,
): Promise<ApiResponse<IamResource[]>> =>
  apiClient.v2.get('/iam/resource', { data: params });

export type GetiamResourceResourceUrnParams = {
  /** ResourceURN */
  resourceURN: string;
};

export const getiamResourceResourceURNQueryKey = (
  params: GetiamResourceResourceUrnParams,
) => [`get/iam/resource/${params.resourceURN}`];

/**
 *  : Retrieve a resource
 */
export const getiamResourceResourceURN = async (
  params: GetiamResourceResourceUrnParams,
): Promise<ApiResponse<IamResource>> =>
  apiClient.v2.get(`/iam/resource/${params.resourceURN}`);
