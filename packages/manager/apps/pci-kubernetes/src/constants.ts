import { ChangelogLinks } from '@ovh-ux/manager-react-components';

import { UrlRecord } from './types';

export const TOASTER_SUCCESS_DURATION = 5000;

export const ANTI_AFFINITY_MAX_NODES = 5;

export const NODE_RANGE = {
  MIN: 3,
  MAX: 100,
};

export const AUTOSCALING_LINK = {
  DEFAULT: 'https://docs.ovh.com/gb/en/kubernetes/using-cluster-autoscaler/',
  US: 'https://support.us.ovhcloud.com/hc/en-us/articles/1500009150301',
};

export const TRACKING_PREFIX = 'PublicCloud::pci::projects::project::kubernetes';

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

export const KUBECONFIG_3AZ_GATEWAY = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0050015',
  ASIA: 'https://help.ovhcloud.com/csm/asia-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0050009',
  AU: 'https://help.ovhcloud.com/csm/en-au-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0050010',
  CA: 'https://help.ovhcloud.com/csm/en-ca-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0050025',
  DE: 'https://help.ovhcloud.com/csm/de-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055381',
  ES: 'https://help.ovhcloud.com/csm/es-es-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055384',
  EU: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0037610',
  FR: 'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055392',
  GB: 'https://help.ovhcloud.com/csm/en-gb-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0050016',
  IE: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0037610',
  IN: 'https://help.ovhcloud.com/csm/en-in-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0069363',
  IT: 'https://help.ovhcloud.com/csm/it-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055388',
  MA: 'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055392',
  NL: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0037610',
  PL: 'https://help.ovhcloud.com/csm/pl-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055394',
  PT: 'https://help.ovhcloud.com/csm/pt-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055390',
  QC: 'https://help.ovhcloud.com/csm/fr-ca-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055387',
  SG: 'https://help.ovhcloud.com/csm/en-sg-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0050017',
  SN: 'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055392',
  TN: 'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055392',
  US: 'https://support.us.ovhcloud.com/hc/en-us/articles/1500009286462-How-to-Use-vRack-with-OVHcloud-Managed-Kubernetes',
  WE: 'https://help.ovhcloud.com/csm/en-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0050015',
  WS: 'https://help.ovhcloud.com/csm/es-public-cloud-kubernetes-using-vrack?id=kb_article_view&sysparm_article=KB0055385',
};

export const VERSIONS_GUIDE_URL = 'https://docs.ovh.com/gb/en/kubernetes/eos-eol-policies/';

export const KUBECONFIG_URL =
  'https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig';

export const KUBECTL_URL = 'https://kubernetes.io/docs/reference/kubectl/overview/';

export const KUBE_INSTALL_URL = {
  DEFAULT: 'https://docs.ovh.com/gb/en/kubernetes/installing-kubernetes-dashboard/',
  US: 'https://support.us.ovhcloud.com/hc/en-us/articles/1500004918182-Installing-the-Kubernetes-Dashboard-on-OVHcloud-Managed-Kubernetes',
};

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

export const UPGRADE_POLICIES = ['ALWAYS_UPDATE', 'MINIMAL_DOWNTIME', 'NEVER_UPDATE'];

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
  ASIA: 'https://help.ovhcloud.com/csm/asia-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0037444',
  AU: 'https://help.ovhcloud.com/csm/en-au-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049877',
  CA: 'https://help.ovhcloud.com/csm/en-ca-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049868',
  DE: 'https://help.ovhcloud.com/csm/de-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055207',
  ES: 'https://help.ovhcloud.com/csm/es-es-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055208',
  EU: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049871',
  FR: 'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  GB: 'https://help.ovhcloud.com/csm/en-gb-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049884',
  IE: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049871',
  IN: 'https://help.ovhcloud.com/csm/asia-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0037444',
  IT: 'https://help.ovhcloud.com/csm/it-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055212',
  MA: 'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  NL: 'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
  PL: 'https://help.ovhcloud.com/csm/pl-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055213',
  PT: 'https://help.ovhcloud.com/csm/pt-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055215',
  QC: 'https://help.ovhcloud.com/csm/fr-ca-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055209',
  SG: 'https://help.ovhcloud.com/csm/en-sg-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049872',
  SN: 'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  TN: 'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  US: 'https://support.us.ovhcloud.com/hc/en-us/articles/1500005048361-Managed-Kubernetes-Known-Limits',
  WE: 'https://help.ovhcloud.com/csm/en-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049873',
  WS: 'https://help.ovhcloud.com/csm/es-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055210',
};

export const LOAD_BALANCER_DOC = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059277',
  ASIA: 'https://help.ovhcloud.com/csm/asia-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059273',
  AU: 'https://help.ovhcloud.com/csm/en-au-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059272',
  CA: 'https://help.ovhcloud.com/csm/en-ca-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059276',
  DE: 'https://help.ovhcloud.com/csm/de-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059267',
  ES: 'https://help.ovhcloud.com/csm/es-es-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059274',
  EU: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059275',
  FR: 'https://help.ovhcloud.com/csm/fr-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059279',
  GB: 'https://help.ovhcloud.com/csm/en-gb-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059283',
  IE: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059275',
  IN: 'https://help.ovhcloud.com/csm/asia-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059273',
  IT: 'https://help.ovhcloud.com/csm/it-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059284',
  MA: 'https://help.ovhcloud.com/csm/fr-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059279',
  NL: 'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
  PL: 'https://help.ovhcloud.com/csm/pl-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059281',
  PT: 'https://help.ovhcloud.com/csm/pt-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059285',
  QC: 'https://help.ovhcloud.com/csm/fr-ca-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059282',
  SG: 'https://help.ovhcloud.com/csm/en-sg-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059280',
  SN: 'https://help.ovhcloud.com/csm/fr-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059279',
  TN: 'https://help.ovhcloud.com/csm/fr-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059279',
  US: 'https://support.us.ovhcloud.com/hc/en-us/articles/21133261407251-Concepts-Load-Balancer',
  WE: 'https://help.ovhcloud.com/csm/en-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059277',
  WS: 'https://help.ovhcloud.com/csm/es-public-cloud-network-load-balancer-concepts?id=kb_article_view&sysparm_article=KB0059278',
};

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Kubernetes+Service',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Kubernetes+Service',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export const DEPLOYMENT_URL = {
  ASIA: 'https://help.ovhcloud.com/csm/asia-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066023',
  AU: 'https://help.ovhcloud.com/csm/en-au-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066022',
  CA: 'https://help.ovhcloud.com/csm/en-ca-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066032',
  GB: 'https://help.ovhcloud.com/csm/en-gb-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066027',
  IE: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066035',
  IN: 'https://help.ovhcloud.com/csm/asia-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066023',
  SG: 'https://help.ovhcloud.com/csm/en-sg-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066026',
  DE: 'https://help.ovhcloud.com/csm/de-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066036',
  ES: 'https://help.ovhcloud.com/csm/es-es-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066024',
  FR: 'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  IT: 'https://help.ovhcloud.com/csm/es-es-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066024',
  MA: 'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  SN: 'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  TN: 'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  NL: 'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
  PL: 'https://help.ovhcloud.com/csm/pl-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066030',
  PT: 'https://help.ovhcloud.com/csm/pt-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066025',
  QC: 'https://help.ovhcloud.com/csm/fr-ca-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066034',
  US: 'https://us.ovhcloud.com/support/',
  WS: 'https://help.ovhcloud.com/csm/es-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066028',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066027',
};

export const PLAN_DOC_LINKS: UrlRecord = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/kubernetes/#prix',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/kubernetes/#prix',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/kubernetes/#prix',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/kubernetes/#prix',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/kubernetes/#prix',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/kubernetes/#prix',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/kubernetes/#prix',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/kubernetes/#prix',
  WE: 'https://www.ovhcloud.com/en/public-cloud/kubernetes/#prix',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/kubernetes/#prix',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/kubernetes/#prix',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/kubernetes/#prix',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/kubernetes/#prix',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/kubernetes/#prix',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/kubernetes/#prix',
  WS: 'https://www.ovhcloud.com/es/public-cloud/kubernetes/#prix',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/kubernetes/#prix',
  IT: 'https://www.ovhcloud.com/it/public-cloud/kubernetes/#prix',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/kubernetes/#prix',
  DE: 'https://www.ovhcloud.com/de/public-cloud/kubernetes/#prix',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/kubernetes/#prix',
  US: 'https://us.ovhcloud.com/public-cloud/kubernetes/#prix',
};

export const IAM_AUTHENTICATION_INFOS_PRICE = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/#compute',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/prices/#compute',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices/#compute',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/#compute',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#compute',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/#compute',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#compute',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#compute',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#compute',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/prices/#compute',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#compute',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices/#compute',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#compute',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#compute',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#compute',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/#compute',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/prices/#compute',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices/#compute',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices/#compute',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/#compute',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices/#compute',
  US: 'https://us.ovhcloud.com/public-cloud/prices/#compute',
};

export const IAM_AUTHENTICATION_INFOS = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050152',
  ASIA: 'https://help.ovhcloud.com/csm/asia-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050155',
  AU: 'https://help.ovhcloud.com/csm/en-au-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050157',
  CA: 'https://help.ovhcloud.com/csm/en-ca-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050146',
  DE: 'https://help.ovhcloud.com/csm/de-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0037798',
  ES: 'https://help.ovhcloud.com/csm/es-es-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050166',
  FR: 'https://help.ovhcloud.com/csm/fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159',
  GB: 'https://help.ovhcloud.com/csm/en-gb-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050147',
  IE: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050162',
  IN: 'https://help.ovhcloud.com/csm/en-in-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0069583',
  IT: 'https://help.ovhcloud.com/csm/it-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050156',
  MA: 'https://help.ovhcloud.com/csm/fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159',
  NL: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050162',
  PL: 'https://help.ovhcloud.com/csm/pl-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050160',
  PT: 'https://help.ovhcloud.com/csm/pt-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050161',
  QC: 'https://help.ovhcloud.com/csm/fr-ca-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050158',
  SG: 'https://help.ovhcloud.com/csm/en-sg-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050150',
  SN: 'https://help.ovhcloud.com/csm/fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159',
  TN: 'https://help.ovhcloud.com/csm/fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159',
  WE: 'https://help.ovhcloud.com/csm/en-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050152',
  WS: 'https://help.ovhcloud.com/csm/es-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050169',
  US: 'https://support.us.ovhcloud.com/hc/en-us/articles/21134381741715-Concepts-Additional-IP-or-Floating-IP',
};

export type KubeconfigPricingRegion = keyof typeof PLAN_DOC_LINKS;
