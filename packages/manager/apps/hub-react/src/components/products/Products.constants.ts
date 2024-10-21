export const productListingPages: Record<
  string,
  { application: string; hash: string }
> = {
  CDN_DEDICATED: {
    application: 'dedicated',
    hash: '#/configuration/cdn',
  },
  CLOUD_DB_ENTERPRISE_CLUSTER: {
    application: 'dedicated',
    hash: '#/enterprise-cloud-database',
  },
  CLOUD_PROJECT: {
    application: 'public-cloud',
    hash: '#/pci/projects',
  },
  DBAAS_LOGS: {
    application: 'dedicated',
    hash: '#/dbaas/logs',
  },
  DEDICATED_CEPH: {
    application: 'dedicated',
    hash: '#/cda',
  },
  DEDICATED_CLOUD: {
    application: 'dedicated',
    hash: '#/dedicated_cloud',
  },
  DEDICATED_HOUSING: {
    application: 'dedicated',
    hash: '#/housing',
  },
  DEDICATED_NASHA: {
    application: 'dedicated',
    hash: '#/nasha',
  },
  DEDICATED_SERVER: {
    application: 'dedicated',
    hash: '#/server',
  },
  DOMAIN: {
    application: 'web',
    hash: '#/domain',
  },
  DOMAIN_ZONE: {
    application: 'web',
    hash: '#/zone',
  },
  EMAIL_DOMAIN: {
    application: 'web',
    hash: '#/email_domain',
  },
  EMAIL_EXCHANGE_SERVICE: {
    application: 'web',
    hash: '#/exchange',
  },
  EMAIL_PRO: {
    application: 'web',
    hash: '#/email_pro',
  },
  ESSENTIALS: {
    application: 'dedicated',
    hash: '#/managedBaremetal',
  },
  FREEFAX: {
    application: 'telecom',
    hash: '#/freefax',
  },
  HOSTING_PRIVATE_DATABASE: {
    application: 'web',
    hash: '#/private_database',
  },
  HOSTING_WEB: {
    application: 'web',
    hash: '#/hosting',
  },
  IP_LOADBALANCING: {
    application: 'dedicated',
    hash: '#/iplb',
  },
  IP_SERVICE: {
    application: 'dedicated',
    hash: '#/ip',
  },
  KEY_MANAGEMENT_SERVICE: {
    application: 'key-management-service',
    hash: '#',
  },
  LICENSE_CPANEL: {
    application: 'dedicated',
    hash: '#/license',
  },
  LICENSE_CLOUD_LINUX: {
    application: 'dedicated',
    hash: '#/license',
  },
  LICENSE_DIRECTADMIN: {
    application: 'dedicated',
    hash: '#/license',
  },
  LICENSE_DIRECT_ADMIN: {
    application: 'dedicated',
    hash: '#/license',
  },
  LICENSE_OFFICE: {
    application: 'web',
    hash: '#/office/license',
  },
  LICENSE_PLESK: {
    application: 'dedicated',
    hash: '#/license',
  },
  LICENSE_SQLSERVER: {
    application: 'dedicated',
    hash: '#/license',
  },
  LICENCE_VIRTUOZZO: {
    application: 'dedicated',
    hash: '#/license',
  },
  LICENSE_WINDOWS: {
    application: 'dedicated',
    hash: '#/license',
  },
  LICENSE_WORKLIGHT: {
    application: 'dedicated',
    hash: '#/license',
  },
  MS_SERVICES_SHAREPOINT: {
    application: 'web',
    hash: '#/sharepoint',
  },
  NUTANIX: {
    application: 'dedicated',
    hash: '#/nutanix',
  },
  OVH_CLOUD_CONNECT: {
    application: 'dedicated',
    hash: '#/cloud-connect',
  },
  OVER_THE_BOX: {
    application: 'telecom',
    hash: '#/overTheBox',
  },
  PACK_XDSL: {
    application: 'telecom',
    hash: '#/pack',
  },
  SMS: {
    application: 'telecom',
    hash: '#/sms',
  },
  STORAGE_NETAPP: {
    application: 'dedicated',
    hash: '#/netapp',
  },
  TELEPHONY: {
    application: 'telecom',
    hash: '#/telephony',
  },
  VEEAM_CLOUD_CONNECT: {
    application: 'dedicated',
    hash: '#/veeam',
  },
  VEEAM_VEEAM_ENTERPRISE: {
    application: 'dedicated',
    hash: '#/veeam-enterprise',
  },
  VMWARE_CLOUD_DIRECTOR: {
    application: 'hpc-vmware-managed-vcd',
    hash: '#',
  },
  VMWARE_CLOUD_DIRECTOR_BACKUP: {
    application: 'veeam-backup',
    hash: '#/',
  },
  VPS: {
    application: 'dedicated',
    hash: '#/vps',
  },
  VRACK: {
    application: 'dedicated',
    hash: '#/vrack',
  },
  WEB_PAA_S_SUBSCRIPTION: {
    application: 'web',
    hash: '#/paas/webpaas/projects',
  },
  WEB_PAAS_SUBSCRIPTION: {
    application: 'web',
    hash: '#/paas/webpaas/projects',
  },
  XDSL: {
    application: 'telecom',
    hash: '#/pack',
  },
};

export const DEFAULT_DISPLAYED_PRODUCTS = 6;
export const DEFAULT_DISPLAYED_SERVICES = 4;
