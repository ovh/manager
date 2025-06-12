export const FEATURE_AVAILABILITY = {
  SAVINGS_PLAN: 'pci-savings-plan',
  DATABASES_ANALYTICS: 'pci-databases-analytics',
};

export const ITALY_AGREEMENT_TEXT = {
  TITLE:
    "Il Cliente dichiara di riconoscere, accettare ed approvare espressamente, ai sensi dell'art. 1341, secondo comma, e dell'art. 1342, secondo comma, del Codice Civile",
  LINK: 'Le specifiche clausole indicate qui',
  DETAILS:
    "Il Cliente dichiara di riconoscere, accettare ed approvare espressamente, ai sensi dell'art. 1341, secondo comma, e dell'art. 1342, secondo comma, del Codice Civile, le seguenti specifiche clausole del presente Contratto: 2.5 (“Chiusura dell’Account Cliente”), 3.7 (“Sospensione dei Servizi”), 4.2 (“SLA”), 4.3 (“Crediti di servizio”), 5.2 (“Modifica dei Servizi ordinati”), 7.1 (“Casi di e-mail fraudolente e indesiderate”), 7.3 (“Sospensione e disattivazione”), 10.2 (“Responsabilità di OVHcloud”), 10.3 (“Limitazioni di responsabilità”), 10.4 (“Eccezioni”), 10.6 (“Responsabilità del Cliente”), 10.7 (“Garanzie”), 10.8 (“Forza Maggiore”), 11.2 (“Modifica delle tariffe”), 11.6 (“Mancato pagamento e ritardo nel pagamento”), 11.7 (“Contestazione”), 12.2 (“Rinnovo dei Servizi”), 14.1 (“Legge applicabile e foro competente”), 14.2, ult. cpv. (“Sanzioni internazionali e Controllo delle esportazioni”), 14.7 (“Modifiche al Contratto”), 14.9 (“Cessione del contratto”).",
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
