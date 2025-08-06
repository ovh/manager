import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export const INSTANCE_PRICING_LINKS: { [Key in OvhSubsidiary]?: string } & {
  DEFAULT: string;
} = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/prices',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/prices',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/prices',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices',
};

export const actionSectionRegex = /(?:rescue\/(start|end)|(?<!rescue\/)(start|stop|shelve|unshelve|delete|soft-reboot|hard-reboot|reinstall|backup|billing\/monthly\/activate))$/;

export const instanceNameRegex = /^[a-zA-Z0-9-_.]{0,255}$/;

export const CHANGELOG_LINKS = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Compute',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Compute',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};
