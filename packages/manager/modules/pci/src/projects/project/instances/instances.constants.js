export const BANDWIDTH_CONSUMPTION = 'bandwidth_instance';

export const BANDWIDTH_LIMIT = 1025;

export const BANDWIDTH_OUT_INVOICE = 'bandwidth_instance_out';

export const INSTANCE_BACKUP_CONSUMPTION = 'snapshot.consumption';

export const INSTANCE_HELP_REFERENCE_KEY = 'PCI_PROJECTS_INSTANCES_HELP_SHOW_';

export const TYPES_TO_EXCLUDE = [/baremetal/];

export const POLLER_INSTANCE_NAMESPACE = {
  SHELVE: 'cloud.project.instance.shelve',
  UNSHELVE: 'cloud.project.instance.unshelve',
};

export default {
  BANDWIDTH_CONSUMPTION,
  BANDWIDTH_LIMIT,
  BANDWIDTH_OUT_INVOICE,
  INSTANCE_BACKUP_CONSUMPTION,
  INSTANCE_HELP_REFERENCE_KEY,
  POLLER_INSTANCE_NAMESPACE,
  TYPES_TO_EXCLUDE,
};
