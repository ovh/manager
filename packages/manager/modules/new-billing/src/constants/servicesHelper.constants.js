export const SERVICES_TARGET_URLS = {
  '/cdn/dedicated/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/cdn/:serviceName',
  },
  '/cloud/project/{serviceName}': {
    universe: 'cloud',
    url: '#/iaas/pci/project/:serviceName/compute/infrastructure/diagram',
    type: 'pci',
  },
  '/dedicated/nasha/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/nas/nas/nasha_:serviceName',
  },
  '/domain/zone/{zoneName}': {
    universe: 'web',
    url: '#/configuration/domain/:serviceName',
  },
  '/domain/zone/{zoneName}/history': {
    universe: 'web',
    url: '#/configuration/domain/:serviceName/history',
  },
  '/hosting/web/{serviceName}': {
    universe: 'web',
    url: '#/configuration/hosting/:serviceName',
  },
  '/hosting/privateDatabase/{serviceName}': {
    universe: 'web',
    url: '#/configuration/private_database/:serviceName',
  },
  '/email/domain/{domain}': {
    universe: 'web',
    url: '#/configuration/email-domain/:serviceName',
  },
  '/email/pro/{service}': {
    universe: 'web',
    url: '#/configuration/email_pro/:serviceName',
  },
  '/license/office/{serviceName}': {
    universe: 'web',
    url: '#/configuration/microsoft/office/license/:serviceName',
  },
  '/dbaas/logs/{serviceName}': {
    universe: 'cloud',
    url: '#/dbaas/logs/:serviceName/home',
  },
  '/dedicated/housing/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/housing/:serviceName',
  },
  '/dedicated/server/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/server/:serviceName',
  },
  '/dedicatedCloud/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/dedicated_cloud/:serviceName',
  },
  '/domain/{serviceName}': {
    universe: 'web',
    url: '#/configuration/domain/:serviceName',
  },
  '/ip/service/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/ip',
  },
  '/ipLoadbalancing/{serviceName}': {
    universe: 'dedicated',
    url: '#/network/iplb/:serviceName',
  },
  '/license/plesk/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/license/:serviceName/detail',
  },
  '/license/windows/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/license/:serviceName/detail',
  },
  '/license/sqlserver/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/license/:serviceName/detail',
  },
  '/license/virtuozzo/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/license/:serviceName/detail',
  },
  '/license/worklight/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/license/:serviceName/detail',
  },
  '/license/cpanel/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/license/:serviceName/detail',
  },
  '/license/directadmin/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/license/:serviceName/detail',
  },
  '/license/cloudlinux/{serviceName}': {
    universe: 'dedicated',
    url: '#/configuration/license/:serviceName/detail',
  },
  '/pack/xdsl/{packName}': {
    universe: 'telecom',
    url: '#/pack/:serviceName',
  },
  '/telephony/{billingAccount}': {
    universe: 'telecom',
    url: '#/telephony/:serviceName',
  },
  '/telephony/lines/{serviceName}': {
    universe: 'telecom',
  },
  '/sms/{serviceName}': {
    universe: 'telecom',
    url: '#/sms/:serviceName',
  },
  '/freefax/{serviceName}': {
    universe: 'telecom',
    url: '#/freefax/:serviceName',
  },
  '/overTheBox/{serviceName}': {
    universe: 'telecom',
    url: '#/overTheBox/:serviceName/details',
  },
  '/vps/{serviceName}': {
    universe: 'cloud',
    url: '#/iaas/vps/:serviceName/dashboard',
  },
  '/vrack/{serviceName}': {
    universe: 'cloud',
    url: '#/vrack/:serviceName',
  },
  '/deskaas/{serviceName}': {
    universe: 'cloud',
    url: '#/deskaas/:serviceName',
  },
};

export default { SERVICES_TARGET_URLS };
