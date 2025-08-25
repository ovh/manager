import { apiClient } from '@ovh-ux/manager-core-api';

export type ResourceType =
  | 'ovhCloudConnect'
  | 'packXdsl'
  | 'veeamCloudConnect'
  | 'voipPhoneSpare'
  | 'dedicatedCeph'
  | 'licenseVirtuozzo'
  | 'nutanix'
  | 'overTheBox'
  | 'vps'
  | 'webHosting'
  | 'dedicatedNVMeoF'
  | 'sms'
  | 'voip'
  | 'voipTrunk'
  | 'ldp/osd'
  | 'okms/secret'
  | 'sdwan'
  | 'emailMxplan'
  | 'hadoopClusterAccount'
  | 'ipUnshielded'
  | 'licenseWorklight'
  | 'pccManagementFee'
  | 'pccVMware'
  | 'account'
  | 'housing'
  | 'loadbalancer'
  | 'overTheBoxHardware'
  | 'vpsAdditionalDisk'
  | 'vrackServices'
  | 'webCloudDatabases'
  | 'clusterDelivery'
  | 'licenseCpanel'
  | 'mxplanAccount'
  | 'pccServicePack'
  | 'voipLine'
  | 'freefax'
  | 'ipService'
  | 'licenseRedHat'
  | 'okms/serviceKey'
  | 'sharepoint'
  | 'zimbraPlatform'
  | 'alldom'
  | 'horizonView'
  | 'licenseHycu'
  | 'packSipTrunk'
  | 'licenseWindows'
  | 'metrics'
  | 'pccVMware/sapPreInstallation'
  | 'xdslEmail'
  | 'cspReseller'
  | 'ip'
  | 'ldp/alias'
  | 'licenseDirectAdmin'
  | 'xdslSpare'
  | 'zimbraPlatform/account'
  | 'licenseCloudLinux'
  | 'licenseOffice'
  | 'licenseOfficePrepaid'
  | 'nas'
  | 'cloudDB'
  | 'dedicatedServerIronic'
  | 'emailPro'
  | 'ldp/stream'
  | 'publicCloudProject/managedRegistry'
  | 'vmwareCloudDirector'
  | 'zimbraPlatform/organization'
  | 'licenseSqlServer'
  | 'voipSmsvn'
  | 'ldp'
  | 'okms'
  | 'okms/kmip'
  | 'vrack'
  | 'voipAlias'
  | 'dnsZone'
  | 'storageNetApp'
  | 'supportVIP'
  | 'veeamEnterprise'
  | 'microsoftServices'
  | 'vmwareCloudDirector/virtualDataCenter'
  | 'xdsl'
  | 'dedicatedServer'
  | 'dockerRegistry'
  | 'ldp/index'
  | 'licensePlesk'
  | 'partner'
  | 'publicCloudProject'
  | 'stackMis'
  | 'vmwareCloudDirectorBackup'
  | 'cdn'
  | 'domain'
  | 'legacyVrack'
  | 'nasHA'
  | 'ssl'
  | 'sslGateway'
  | 'webPaaS'
  | 'emailDomain'
  | 'hostingOption'
  | 'ldp/dashboard'
  | 'ldp/tenant';

export type IamResource = {
  id: string;
  urn: string;
  name: string;
  displayName: string;
  type: ResourceType;
  owner: string;
};

export type GetServiceList = {
  dedicatedCloud: IamResource[];
  server: IamResource[];
  vps: IamResource[];
  vrack: IamResource[];
};

export const getServiceList = async (): Promise<GetServiceList> => {
  const response = await apiClient.v2.get<IamResource[]>(
    `/iam/resource?${['pccVMware', 'vrack', 'dedicatedServer', 'vps']
      .map((t) => `resourceType=${t}`)
      .join('&')}`,
    {
      headers: {
        'X-Pagination-Size': 10000,
      },
    },
  );
  return {
    dedicatedCloud: response?.data?.filter((r) => r.type === 'pccVMware'),
    server: response?.data?.filter((r) => r.type === 'dedicatedServer'),
    vps: response?.data?.filter((r) => r.type === 'vps'),
    vrack: response?.data?.filter((r) => r.type === 'vrack'),
  };
};
