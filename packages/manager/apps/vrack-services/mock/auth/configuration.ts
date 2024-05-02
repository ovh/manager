import user from './user.json';

export const defaultRegion = 'EU';

export const getConfigurationResponse = ({
  region = defaultRegion,
}): unknown => ({
  region,
  user,
  applicationURLs: {
    cloud: 'https://www.ovh.com/manager/cloud/repsac/',
    dedicated: 'https://www.ovh.com/manager/dedicated/',
    hub: 'https://www.ovh.com/manager/hub/',
    'public-cloud': 'https://www.ovh.com/manager/public-cloud/',
    telecom: 'https://www.ovhtelecom.fr/manager/telecom/',
    web: 'https://www.ovh.com/manager/web/',
    sunrise: 'https://www.ovh.com/manager/sunrise/',
    billing: 'https://www.ovh.com/manager/dedicated/#/billing',
    user: 'https://www.ovh.com/manager/dedicated/',
    exchange: 'https://www.ovh.com/manager/web/',
    sharepoint: 'https://www.ovh.com/manager/web/',
    office: 'https://www.ovh.com/manager/web/',
    telephony: 'https://www.ovhtelecom.fr/manager/telecom/',
    'pack-xdsl': 'https://www.ovhtelecom.fr/manager/telecom/',
    overthebox: 'https://www.ovhtelecom.fr/manager/telecom/',
    freefax: 'https://www.ovhtelecom.fr/manager/telecom/',
    sms: 'https://www.ovhtelecom.fr/manager/telecom/',
    catalog: 'https://www.ovh.com/manager/catalog',
    iam: 'https://www.ovh.com/manager/security',
    'carbon-calculator': 'https://www.ovh.com/manager/carbon-calculator/',
    'octavia-load-balancer':
      'https://www.ovh.com/manager/octavia-load-balancer/',
    'pci-vouchers': 'https://www.ovh.com/manager/pci-vouchers/',
    restricted: 'https://www.ovh.com/manager/restricted/',
    'vrack-services': 'https://www.ovh.com/manager/vrack-services/',
  },
  universe: '',
  message: null,
  applications: {
    cloud: {
      universe: 'server',
      url: 'https://www.ovh.com/manager/cloud/repsac/',
      container: { isDefault: false },
      publicURL: 'https://www.ovh.com/manager/cloud/repsac/',
    },
    dedicated: {
      universe: 'server',
      url: 'https://www.ovh.com/manager/dedicated/',
      container: { isDefault: false, enabled: true, path: 'dedicated' },
      publicURL: 'https://www.ovh.com/manager/#/dedicated',
    },
    hub: {
      universe: 'hub',
      url: 'https://www.ovh.com/manager/hub/',
      container: { isDefault: true, enabled: true, path: 'hub' },
      publicURL: 'https://www.ovh.com/manager/#/hub',
    },
    'public-cloud': {
      universe: 'public-cloud',
      url: 'https://www.ovh.com/manager/public-cloud/',
      container: {
        isDefault: false,
        enabled: true,
        path: 'public-cloud',
      },
      publicURL: 'https://www.ovh.com/manager/#/public-cloud',
    },
    telecom: {
      universe: 'telecom',
      url: 'https://www.ovhtelecom.fr/manager/telecom/',
      container: { isDefault: false, enabled: true, path: 'telecom' },
      publicURL: 'https://www.ovhtelecom.fr/manager/#/telecom',
    },
    web: {
      universe: 'web',
      url: 'https://www.ovh.com/manager/web/',
      container: { isDefault: false, enabled: true, path: 'web' },
      publicURL: 'https://www.ovh.com/manager/#/web',
    },
    sunrise: {
      url: 'https://www.ovh.com/manager/sunrise/',
      container: { isDefault: false },
      publicURL: 'https://www.ovh.com/manager/sunrise/',
    },
    billing: {
      universe: 'server',
      url: 'https://www.ovh.com/manager/dedicated/#/billing',
      container: { isDefault: false },
      publicURL: 'https://www.ovh.com/manager/dedicated/#/billing',
    },
    user: {
      universe: 'server',
      url: 'https://www.ovh.com/manager/dedicated/',
      container: { isDefault: false },
      publicURL: 'https://www.ovh.com/manager/dedicated/',
    },
    exchange: {
      universe: 'web',
      url: 'https://www.ovh.com/manager/web/',
      container: { isDefault: false },
      publicURL: 'https://www.ovh.com/manager/web/',
    },
    sharepoint: {
      universe: 'web',
      url: 'https://www.ovh.com/manager/web/',
      container: { isDefault: false },
      publicURL: 'https://www.ovh.com/manager/web/',
    },
    office: {
      universe: 'web',
      url: 'https://www.ovh.com/manager/web/',
      container: { isDefault: false },
      publicURL: 'https://www.ovh.com/manager/web/',
    },
    telephony: {
      universe: 'telecom',
      url: 'https://www.ovhtelecom.fr/manager/telecom/',
      container: { isDefault: false },
      publicURL: 'https://www.ovhtelecom.fr/manager/telecom/',
    },
    'pack-xdsl': {
      universe: 'telecom',
      url: 'https://www.ovhtelecom.fr/manager/telecom/',
      container: { isDefault: false },
      publicURL: 'https://www.ovhtelecom.fr/manager/telecom/',
    },
    overthebox: {
      universe: 'telecom',
      url: 'https://www.ovhtelecom.fr/manager/telecom/',
      container: { isDefault: false },
      publicURL: 'https://www.ovhtelecom.fr/manager/telecom/',
    },
    freefax: {
      universe: 'telecom',
      url: 'https://www.ovhtelecom.fr/manager/telecom/',
      container: { isDefault: false },
      publicURL: 'https://www.ovhtelecom.fr/manager/telecom/',
    },
    sms: {
      universe: 'telecom',
      url: 'https://www.ovhtelecom.fr/manager/telecom/',
      container: { isDefault: false },
      publicURL: 'https://www.ovhtelecom.fr/manager/telecom/',
    },
    catalog: {
      universe: 'hub',
      url: 'https://www.ovh.com/manager/catalog',
      container: { isDefault: false, enabled: true, path: 'catalog' },
      publicURL: 'https://www.ovh.com/manager/#/catalog',
    },
    iam: {
      universe: 'server',
      url: 'https://www.ovh.com/manager/security',
      container: { isDefault: false, enabled: true, path: 'iam' },
      publicURL: 'https://www.ovh.com/manager/#/iam',
    },
    'carbon-calculator': {
      universe: 'server',
      url: 'https://www.ovh.com/manager/carbon-calculator/',
      container: {
        isDefault: false,
        enabled: true,
        path: 'carbon-calculator',
      },
      publicURL: 'https://www.ovh.com/manager/#/carbon-calculator',
    },
    'octavia-load-balancer': {
      universe: 'public-cloud',
      url: 'https://www.ovh.com/manager/octavia-load-balancer/',
      container: {
        isDefault: false,
        enabled: true,
        path: 'public-cloud',
        hash: '/pci/projects/:projectId/octavia-load-balancer',
      },
      publicURL: 'https://www.ovh.com/manager/#/public-cloud',
    },
    'pci-vouchers': {
      universe: 'public-cloud',
      url: 'https://www.ovh.com/manager/pci-vouchers/',
      container: {
        isDefault: false,
        enabled: true,
        path: 'public-cloud',
        hash: '/pci/projects/:projectId/vouchers',
      },
      publicURL: 'https://www.ovh.com/manager/#/public-cloud',
    },
    restricted: {
      universe: 'server',
      url: 'https://www.ovh.com/manager/restricted/',
      container: { isDefault: false, path: 'restricted' },
      publicURL: 'https://www.ovh.com/manager/restricted/',
    },
    'vrack-services': {
      universe: 'server',
      url: 'ttps://www.ovh.com/manager/vrack-services/',
      container: {
        isDefault: false,
        path: 'dedicated',
        hash: '/vrack-services',
      },
      publicURL: 'ttps://www.ovh.com/manager/vrack-services/',
    },
  },
});
