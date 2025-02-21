import { PCI_FEATURES } from '../../projects.constant';
import Instance from '../../../components/project/instance/instance.class';

export const BANDWIDTH_CONSUMPTION = 'bandwidth_instance';

export const BANDWIDTH_LIMIT = 1025;

export const BANDWIDTH_OUT_INVOICE = 'bandwidth_instance_out';

export const INSTANCE_BACKUP_CONSUMPTION = 'snapshot.consumption';

export const INSTANCE_HELP_REFERENCE_KEY = 'PCI_PROJECTS_INSTANCES_HELP_SHOW_';

export const FLAVORS_WITHOUT_AUTOMATED_BACKUP = [/baremetal/];

export const FLAVORS_WITHOUT_SOFT_REBOOT = [/baremetal/];

export const FLAVORS_WITHOUT_SUSPEND = [/baremetal/];

export const FLAVORS_WITHOUT_VNC = [/baremetal/];

export const FLAVORS_WITHOUT_ADDITIONAL_IPS = [/baremetal/];

export const POLLER_INSTANCE_NAMESPACE = {
  SHELVE: 'cloud.project.instance.shelve',
  UNSHELVE: 'cloud.project.instance.unshelve',
};

export const POLLER_INSTANCES = [
  {
    needsPolling: (i) => new Instance(i).isShelving(),
    namespace: POLLER_INSTANCE_NAMESPACE.SHELVE,
    isPolled: (i) => new Instance(i).isShelved(),
    successMessage:
      'pci_projects_project_instances_instance_shelve_success_message',
  },
  {
    needsPolling: (i) => new Instance(i).isUnshelving(),
    namespace: POLLER_INSTANCE_NAMESPACE.UNSHELVE,
    isPolled: (i) => new Instance(i).isStarted(),
    successMessage:
      'pci_projects_project_instances_instance_unshelve_success_message',
  },
];

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

export const OPENSTACK_INSTANCE_STATUS = {
  ACTIVE: 'ACTIVE',
  BUILDING: 'BUILDING',
  DELETED: 'DELETED',
  DELETING: 'DELETING',
  ERROR: 'ERROR',
  HARD_REBOOT: 'HARD_REBOOT',
  PASSWORD: 'PASSWORD',
  PAUSED: 'PAUSED',
  REBOOT: 'REBOOT',
  REBUILD: 'REBUILD',
  RESCUED: 'RESCUED',
  RESIZED: 'RESIZED',
  REVERT_RESIZE: 'REVERT_RESIZE',
  SOFT_DELETED: 'SOFT_DELETED',
  STOPPED: 'STOPPED',
  SUSPENDED: 'SUSPENDED',
  UNKNOWN: 'UNKNOWN',
  VERIFY_RESIZE: 'VERIFY_RESIZE',
  MIGRATING: 'MIGRATING',
  RESIZE: 'RESIZE',
  BUILD: 'BUILD',
  SHUTOFF: 'SHUTOFF',
  RESCUE: 'RESCUE',
  SHELVED: 'SHELVED',
  SHELVING: 'SHELVING',
  UNSHELVING: 'UNSHELVING',
  SHELVED_OFFLOADED: 'SHELVED_OFFLOADED',
  RESCUING: 'RESCUING',
  UNRESCUING: 'UNRESCUING',
  SNAPSHOTTING: 'SNAPSHOTTING',
  RESUMING: 'RESUMING',
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

export const DEFAULT_IP = '10.{vlanId}.0.0';

export const WINDOWS_GEN_3_ADDON_PLANCODE =
  'instance.windows-vcore-license.hour.consumption';

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
  FLAVORS_FEATURES_FLIPPING_MAP,
  INSTANCE_PRICING_LINKS,
  OPENSTACK_INSTANCE_STATUS,
  DEFAULT_IP,
  WINDOWS_GEN_3_ADDON_PLANCODE,
};
