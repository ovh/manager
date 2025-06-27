import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export const FEATURE_AVAILABILITY = {
  SAVINGS_PLAN: 'pci-savings-plan',
  DATABASES_ANALYTICS: 'pci-databases-analytics',
  HDS: 'public-cloud:hds',
};

export type TFeatureStateDetail = {
  url: string;
  targetParamKeys?: string[];
  isExternal?: boolean;
  featureAvailability?: string;
};

export type TFeatureState = {
  [key: string]: {
    [key: string]: TFeatureStateDetail;
  };
};

export const PCI_HDS_ADDON = {
  planCodeScope: 'certification.hds',
  certifiedProject: 'publiccloud-certification-hds',
};

const OVH_CLOUD_URL = 'https://www.ovhcloud.com';
const HDS_URL = 'enterprise/certification-conformity/hds/';

type HdsInfo = { [key in OvhSubsidiary]: string };
export const HDS_INFO: Partial<HdsInfo> = {
  DEFAULT: `${OVH_CLOUD_URL}/en/${HDS_URL}`,
  ASIA: `${OVH_CLOUD_URL}/asia/${HDS_URL}`,
  AU: `${OVH_CLOUD_URL}/en-au/${HDS_URL}`,
  CA: `${OVH_CLOUD_URL}/en-ca/${HDS_URL}`,
  DE: `${OVH_CLOUD_URL}/de/${HDS_URL}`,
  ES: `${OVH_CLOUD_URL}/es-es/${HDS_URL}`,
  FR: `${OVH_CLOUD_URL}/fr/${HDS_URL}`,
  GB: `${OVH_CLOUD_URL}/en-gb/${HDS_URL}`,
  IE: `${OVH_CLOUD_URL}/en-ie/${HDS_URL}`,
  IT: `${OVH_CLOUD_URL}/it/${HDS_URL}`,
  MA: `${OVH_CLOUD_URL}/fr-ma/${HDS_URL}`,
  NL: `${OVH_CLOUD_URL}/nl/${HDS_URL}`,
  PL: `${OVH_CLOUD_URL}/pl/${HDS_URL}`,
  PT: `${OVH_CLOUD_URL}/pt/${HDS_URL}`,
  QC: `${OVH_CLOUD_URL}/fr-ca/${HDS_URL}`,
  SG: `${OVH_CLOUD_URL}/en-sg/${HDS_URL}`,
  SN: `${OVH_CLOUD_URL}/fr-sn/${HDS_URL}`,
  TN: `${OVH_CLOUD_URL}/fr-tn/${HDS_URL}`,
  WE: `${OVH_CLOUD_URL}/en/${HDS_URL}`,
  WS: `${OVH_CLOUD_URL}/es/${HDS_URL}`,
};

export const BASE_PROJECT_PATH = '#/pci/projects/:projectId';

export const PCI_FEATURES_STATES: TFeatureState = {
  DATAPLATFORM: {
    LIST: {
      url:
        'https://hq-api.eu.dataplatform.ovh.net/iam/v4/login?authentication_provider=ovh&project=:projectId&app_id=forepaas&response_type=token&redirect_uri=https%3A%2F%2Feu.dataplatform.ovh.net&authorize_bypass=true&token_mode=cookie&force_auth=false',
      isExternal: true,
    },
  },
  INSTANCES: {
    LIST: { url: `${BASE_PROJECT_PATH}/instances` },
    ADD: { url: `${BASE_PROJECT_PATH}/instances/new` },
  },
  BAREMETAL: {
    LIST: { url: `${BASE_PROJECT_PATH}/instances` },
    ADD: { url: `${BASE_PROJECT_PATH}/instances/new?c=baremetal` },
  },
  BLOCKS: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/blocks` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/blocks/new` },
  },
  VOLUME_BACKUP: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/volume-backup` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/volume-backup/create` },
  },
  OBJECTS: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/objects` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/objects/new` },
  },
  DATABASES: {
    LIST: {
      url: `${BASE_PROJECT_PATH}/databases-analytics/operational/services/new`,
      targetParamKeys: ['steps'],
      featureAvailability: FEATURE_AVAILABILITY.DATABASES_ANALYTICS,
    },
    ADD: {
      url: `${BASE_PROJECT_PATH}/databases-analytics/operational/services/new`,
      targetParamKeys: ['steps'],
      featureAvailability: FEATURE_AVAILABILITY.DATABASES_ANALYTICS,
    },
  },
  ARCHIVES: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/cloud-archives` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/cloud-archives/new` },
  },
  SNAPSHOTS: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/volume-snapshots` },
    ADD: {
      url: `${BASE_PROJECT_PATH}/storages/volume-snapshots/:snapshotId/new-volume`,
    },
  },
  CONTAINERS: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/cold-archive` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/cold-archive/new` },
  },
  LOADBALANCER: {
    LIST: { url: `${BASE_PROJECT_PATH}/octavia-load-balancer` },
  },
  PRIVATE_NETWORK: {
    LIST: { url: `${BASE_PROJECT_PATH}/private-networks` },
    ADD: { url: `${BASE_PROJECT_PATH}/private-networks/new` },
  },
  KUBERNETES: {
    LIST: { url: `${BASE_PROJECT_PATH}/kubernetes` },
    ADD: { url: `${BASE_PROJECT_PATH}/kubernetes/new` },
  },
  PRIVATE_REGISTRY: {
    LIST: { url: `${BASE_PROJECT_PATH}/private-registry` },
    ADD: { url: `${BASE_PROJECT_PATH}/private-registry/create` },
  },
  WORKFLOW: {
    LIST: { url: `${BASE_PROJECT_PATH}/workflow` },
    ADD: { url: `${BASE_PROJECT_PATH}/workflow/new` },
  },
  NOTEBOOKS: {
    LIST: { url: `${BASE_PROJECT_PATH}/ai-ml/notebooks` },
    ADD: { url: `${BASE_PROJECT_PATH}/ai-ml/notebooks/new` },
  },
  TRAINING: {
    LIST: { url: `${BASE_PROJECT_PATH}/ai-ml/training` },
    ADD: { url: `${BASE_PROJECT_PATH}/ai-ml/training/new` },
  },
  DATA_PROCESSING: {
    LIST: { url: `${BASE_PROJECT_PATH}/data-processing/jobs` },
    ADD: { url: `${BASE_PROJECT_PATH}/data-processing/jobs/submit-job` },
  },
  PROJECT_MANAGEMENT: {
    QUOTA_AND_REGIONS: { url: `${BASE_PROJECT_PATH}/quota` },
    SSH_KEYS: { url: `${BASE_PROJECT_PATH}/ssh` },
    BILLING_CONTROL: { url: `${BASE_PROJECT_PATH}/billing` },
    CREDIT_AND_VOUCHERS: { url: `${BASE_PROJECT_PATH}/vouchers` },
    CONTACTS_AND_RIGHTS: { url: `${BASE_PROJECT_PATH}/contacts` },
    PROJECT_SETTINGS: { url: `${BASE_PROJECT_PATH}/edit` },
  },
};

export const SUPPORT_URL =
  'https://help.ovhcloud.com/csm?id=csm_get_help&ovhSubsidiary=';
