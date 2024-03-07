import { PCI_FEATURES } from '../../projects.constant';

export const BANDWIDTH_CONSUMPTION = 'bandwidth_instance';

export const BANDWIDTH_LIMIT = 1025;

export const BANDWIDTH_OUT_INVOICE = 'bandwidth_instance_out';

export const INSTANCE_BACKUP_CONSUMPTION = 'snapshot.consumption';

export const INSTANCE_HELP_REFERENCE_KEY = 'PCI_PROJECTS_INSTANCES_HELP_SHOW_';

export const TYPES_TO_EXCLUDE = [];

export const FLAVORS_WITHOUT_AUTOMATED_BACKUP = [/baremetal/];

export const FLAVORS_WITHOUT_SOFT_REBOOT = [/baremetal/];

export const FLAVORS_WITHOUT_SUSPEND = [/baremetal/];

export const FLAVORS_WITHOUT_VNC = [/baremetal/];

export const FLAVORS_WITHOUT_ADDITIONAL_IPS = [/baremetal/];

export const POLLER_INSTANCE_NAMESPACE = {
  SHELVE: 'cloud.project.instance.shelve',
  UNSHELVE: 'cloud.project.instance.unshelve',
};

export const INSTANCE_PRICING_LINKS = {
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

export const FLAVORS_FEATURES_FLIPPING_MAP = {
  balanced: PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.GENERAL,
  cpu: PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.CPU,
  ram: PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.RAM,
  accelerated: PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.GPU,
  discovery: PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.DISCOVERY,
  iops: PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.IOPS,
  baremetal: PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.BAREMETAL,
  localzone: PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.GRIDSCALE_LOCALZONE,
};

export const LOCAL_ZONE_REGION = 'localzone';

export default {
  BANDWIDTH_CONSUMPTION,
  BANDWIDTH_LIMIT,
  BANDWIDTH_OUT_INVOICE,
  INSTANCE_BACKUP_CONSUMPTION,
  INSTANCE_HELP_REFERENCE_KEY,
  FLAVORS_WITHOUT_AUTOMATED_BACKUP,
  FLAVORS_WITHOUT_SOFT_REBOOT,
  FLAVORS_WITHOUT_SUSPEND,
  FLAVORS_WITHOUT_VNC,
  FLAVORS_WITHOUT_ADDITIONAL_IPS,
  POLLER_INSTANCE_NAMESPACE,
  TYPES_TO_EXCLUDE,
  FLAVORS_FEATURES_FLIPPING_MAP,
  LOCAL_ZONE_REGION,
  INSTANCE_PRICING_LINKS,
};
