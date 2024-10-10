export const ANTI_AFFINITY_MAX_NODES = 5;

export const NODE_RANGE = {
  MIN: 3,
  MAX: 100,
};

export const AUTOSCALING_LINK = {
  DEFAULT: 'https://docs.ovh.com/gb/en/kubernetes/using-cluster-autoscaler/',
  US: 'https://support.us.ovhcloud.com/hc/en-us/articles/1500009150301',
};

export const TRACKING_PREFIX =
  'PublicCloud::pci::projects::project::kubernetes';

export const NAME_INPUT_CONSTRAINTS = {
  MAX_LENGTH: 64,
  PATTERN: /^[a-zA-Z](([a-zA-Z0-9-]|_|-)*)[a-zA-Z0-9]$/,
};

export const STATUS = {
  READY: 'READY',
  INSTALLING: 'INSTALLING',
  DELETING: 'DELETING',
  UPDATING: 'UPDATING',
  RESETTING: 'RESETTING',
  ERROR: 'ERROR',
  SUSPENDING: 'SUSPENDING',
  REOPENING: 'REOPENING',
  REDEPLOYING: 'REDEPLOYING',
  SUSPENDED: 'SUSPENDED',
  USER_ERROR: 'USER_ERROR',
  USER_QUOTA_ERROR: 'USER_QUOTA_ERROR',
};

export const CONFIG_FILENAME = 'kubeconfig';

export const VERSIONS_GUIDE_URL =
  'https://docs.ovh.com/gb/en/kubernetes/eos-eol-policies/';

export const KUBECONFIG_URL =
  'https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig';

export const KUBECTL_URL =
  'https://kubernetes.io/docs/reference/kubectl/overview/';

export const KUBE_INSTALL_URL =
  'https://docs.ovh.com/gb/en/kubernetes/installing-kubernetes-dashboard/';

export const PROCESSING_STATUS = [
  'INSTALLING',
  'DELETING',
  'UPDATING',
  'RESETTING',
  'SUSPENDING',
  'MAINTENANCE',
  'REOPENING',
  'REDEPLOYING',
];

export const KUBE_INSTALLING_STATUS = 'INSTALLING';

export const UPGRADE_POLICIES = [
  'ALWAYS_UPDATE',
  'MINIMAL_DOWNTIME',
  'NEVER_UPDATE',
];

export const UPDATE_STRATEGY = {
  PATCH: 'LATEST_PATCH',
  MINOR: 'NEXT_MINOR',
};

export const WORKER_NODE_POLICIES = {
  DELETE: 'delete',
  REINSTALL: 'reinstall',
};

export const TAGS_BLOB = {
  ACTIVE: 'active',
  IS_NEW: 'is_new',
  COMING_SOON: 'coming_soon',
};

export const GATEWAY_IP_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

export const SUBNET_DOC = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049873',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0037444',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049877',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049868',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055207',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055208',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049871',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049884',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049871',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0037444',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055212',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  NL:
    'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055213',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055215',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055209',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049872',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/1500005048361-Managed-Kubernetes-Known-Limits',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049873',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055210',
};

export const LOAD_BALANCER_DOC = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059277',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059273',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059272',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059276',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059267',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059274',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059275',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059279',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059283',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059275',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059273',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059284',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059279',
  NL:
    'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059281',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059285',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059282',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059280',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059279',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059279',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/21133261407251-Concepts-Load-Balancer',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059277',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059278',
};
