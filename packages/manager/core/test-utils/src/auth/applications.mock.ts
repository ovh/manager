export const applications = {
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
};

export const applicationURLs = Object.entries(applications)
  .map(([appName, app]) => ({ appName, url: app.publicURL }))
  .reduce(
    (result, { appName, url }) => ({
      ...result,
      [appName]: url,
    }),
    {},
  );

export default applications;
