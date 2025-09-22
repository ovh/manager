export const PCI_LEVEL2 = '86';
export const PAGE_PREFIX = 'PublicCloud::pci::projects::project';
export const DISCOVERY_PLANCODE = 'project.discovery';

export const TRACKING_PREFIX = 'PublicCloud::projects::managed_kubernetes_cluster';
export const TRACKING_SUFFIX = '_managed_kubernetes_cluster::kubernetes';
const TRACKING_TAB_PREFIX = '::go-to-tab';

export const TRACKING_TABS = {
  SERVICE: `${TRACKING_PREFIX}${TRACKING_TAB_PREFIX}::service${TRACKING_SUFFIX}`,
  NODE_POOL: `${TRACKING_PREFIX}${TRACKING_TAB_PREFIX}::node_pool${TRACKING_SUFFIX}`,
  LOGS: `${TRACKING_PREFIX}${TRACKING_TAB_PREFIX}::logs_access${TRACKING_SUFFIX}`,
  API_SERVER: `${TRACKING_PREFIX}${TRACKING_TAB_PREFIX}::APIserver_access${TRACKING_SUFFIX}`,
};

export const KUBE_TRACK_PREFIX = 'PublicCloud::pci::projects::project::kubernetes';

export const CHANGELOG_CHAPTERS = TRACKING_PREFIX.split('::');
