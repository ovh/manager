export const DEFAULT_PROJECT_KEY = 'PUBLIC_CLOUD_DEFAULT_PROJECT';
export const QUOTA_THRESHOLD = 80;

export const ITALY_AGREEMENT_TEXT = {
  TITLE:
    "Il Cliente dichiara di riconoscere, accettare ed approvare espressamente, ai sensi dell'art. 1341, secondo comma, e dell'art. 1342, secondo comma, del Codice Civile",
  LINK: 'Le specifiche clausole indicate qui',
  DETAILS:
    "Il Cliente dichiara di riconoscere, accettare ed approvare espressamente, ai sensi dell'art. 1341, secondo comma, e dell'art. 1342, secondo comma, del Codice Civile, le seguenti specifiche clausole del presente Contratto: 2.5 (“Chiusura dell’Account Cliente”), 3.7 (“Sospensione dei Servizi”), 4.2 (“SLA”), 4.3 (“Crediti di servizio”), 5.2 (“Modifica dei Servizi ordinati”), 7.1 (“Casi di e-mail fraudolente e indesiderate”), 7.3 (“Sospensione e disattivazione”), 10.2 (“Responsabilità di OVHcloud”), 10.3 (“Limitazioni di responsabilità”), 10.4 (“Eccezioni”), 10.6 (“Responsabilità del Cliente”), 10.7 (“Garanzie”), 10.8 (“Forza Maggiore”), 11.2 (“Modifica delle tariffe”), 11.6 (“Mancato pagamento e ritardo nel pagamento”), 11.7 (“Contestazione”), 12.2 (“Rinnovo dei Servizi”), 14.1 (“Legge applicabile e foro competente”), 14.2, ult. cpv. (“Sanzioni internazionali e Controllo delle esportazioni”), 14.7 (“Modifiche al Contratto”), 14.9 (“Cessione del contratto”).",
};

export const PCI_FEATURES = {
  PROJECT: {
    PAYEMENT_SEPA_DIRECT_DEBIT: 'public-cloud:project:sepa-direct-debit',
  },
  PRODUCTS: {
    INSTANCE: 'instance',
    BLOCK_STORAGE: 'block-storage',
    VOLUME_BACKUP: 'volume-backup',
    OBJECT_STORAGE: 'object-storage',
    DATABASES: 'databases',
    DATABASES_ANALYTICS: 'pci-databases-analytics',
    SNAPSHOT: 'snapshot',
    CLOUD_ARCHIVE: 'archive',
    COLD_ARCHIVE: 'cold-archive',
    INSTANCE_BACKUP: 'instance-backup',
    LOAD_BALANCER: 'load-balancer',
    PRIVATE_NETWORK: 'private-network',
    FAILOVER_IP: 'failover-ip',
    ADDITIONAL_IP: 'additional-ips',
    KUBERNETES: 'kubernetes',
    PRIVATE_REGISTRY: 'private-registry',
    WORKFLOW_MANAGEMENT: 'workflow-management',
    AI_DASHBOARD: 'ai-dashboard',
    NOTEBOOKS: 'notebooks',
    AI_APPS: 'ai-apps',
    TRAINING: 'training',
    SERVING: 'serving',
    ANALYTICS_DATA_PLATFORM: 'analytics-data-platform',
    DATA_PROCESSING: 'data-processing',
    LOGS_DATA_PLATFORM: 'logs-data-platform',
    HORIZON: 'horizon',
    PUBLIC_GATEWAYS: 'public-gateways',
    DATA_PLATFORM: 'data-platform',
  },
  INSTANCE_FLAVORS_CATEGORY: {
    GENERAL: 'instance:flavors-category-general',
    CPU: 'instance:flavors-category-cpu',
    RAM: 'instance:flavors-category-ram',
    GPU: 'instance:flavors-category-gpu',
    SANDBOX: 'instance:flavors-category-sandbox',
    DISCOVERY: 'instance:flavors-category-discovery',
    IOPS: 'instance:flavors-category-iops',
    BAREMETAL: 'instance:flavors-category-baremetal',
    GRIDSCALE_LOCALZONE: 'instance:gridscale-local-zone',
  },
  SETTINGS: {
    USERS: 'public-cloud:users',
    QUOTA: 'public-cloud:quota',
    REGION: 'public-cloud:region',
    SSH_KEYS: 'public-cloud:ssh-keys',
    BILLING: 'public-cloud:billing',
    VOUCHERS: 'public-cloud:vouchers',
    CONTACTS: 'public-cloud:contacts',
    PROJECT: 'public-cloud:project',
    PROJECT_SETTINGS: 'public-cloud:project-settings',
  },
  LINKS: {
    CLOUD_ESSENTIAL_INFORMATION:
      'public-cloud:link-cloud-essential-information',
    PUBLIC_CLOUD_INTERFACE: 'public-cloud:link-public-cloud-interface',
    START_PCI_INSTANCE: 'public-cloud:link-start-public-cloud-instance',
    CLOUD_BILLING_OPTIONS: 'public-cloud:link-cloud-billing-options',
    ALL_GUIDES: 'public-cloud:link-all-guides',
    CREATE_HORIZON_USER: 'public-cloud:link-create-horizon-user',
    DEPLOY_A_PUBLIC_CLOUD_INSTANCE:
      'public-cloud:link-deploy-a-public-cloud-instance',
    START_WITH_BLOCK_STORAGE: 'public-cloud:link-start-with-block-storage',
    ALL_GUIDES_US: 'public-cloud:link-all-guides-us',
    FIRST_CLOUD_SERVER: 'public-cloud:link-first-cloud-server',
    USING_OPEN_STACK_API: 'public-cloud:link-using-open-stack-api',
    SETUP_ADDITIONAL_DISK: 'public-cloud:link-setup-additional-disk',
    DEPLOY_INSTANCE: 'public-cloud:link-deploy-instance',
  },
  BANNERS: {
    BILLING_CHANGE_MEDIATION_BANNER_2:
      'public-cloud:project:billing-change-mediation-banner_2',
    FREE_LOCAL_ZONES_BANNER: 'public-cloud:project:free-local-zones-banner',
  },
  OTHERS: {
    PUBLIC_CLOUD: 'public-cloud',
    CREATE_PROJECT: 'public-cloud:create-project',
    HDS: 'public-cloud:hds',
    TRUSTED_ZONE: 'public-cloud:trusted-zone',
  },
  ACTIONS: {
    INSTANCE_LOCALZONE_BACKUP: 'public-cloud:instance:local-zone-backup',
  },
};

export const PCI_FEATURES_STATES = {
  INSTANCES: {
    LIST: 'pci.projects.project.instances',
    ADD: 'pci.projects.project.instances.add',
  },
  BAREMETAL: {
    LIST: 'pci.projects.project.baremetal',
    ADD: 'pci.projects.project.baremetal.add',
  },
  BLOCKS: {
    LIST: 'pci.projects.project.storages.blocks',
    ADD: 'pci.projects.project.storages.blocks.add',
  },
  VOLUME_BACKUP: {
    LIST: 'pci.projects.project.storages.volume-backup',
    ADD: 'pci.projects.project.storages.volume-backup.create',
  },
  OBJECTS: {
    LIST: 'pci.projects.project.storages.object-storage',
    ADD: 'pci.projects.project.storages.object-storage.add',
  },
  DATABASES: {
    LIST: 'pci.projects.project.storages.databases',
    ADD: 'pci.projects.project.storages.databases.add',
  },
  ARCHIVES: {
    LIST: 'pci.projects.project.storages.archives',
    ADD: 'pci.projects.project.storages.archives.archive.add',
  },
  SNAPSHOTS: {
    LIST: 'pci.projects.project.storages.snapshots',
    ADD: 'pci.projects.project.storages.snapshots.snapshot.create-volume',
  },
  CONTAINERS: {
    LIST: 'pci.projects.project.storages.containers',
    ADD: 'pci.projects.project.storages.containers.add',
  },
  LOADBALANCER: {
    LIST: 'pci.projects.project.loadbalancer',
  },
  PRIVATE_NETWORK: {
    LIST: 'pci.projects.project.privateNetwork',
    ADD: 'pci.projects.project.privateNetwork.new',
  },
  KUBERNETES: {
    LIST: 'pci.projects.project.kubernetes',
    ADD: 'pci.projects.project.kubernetes.add',
  },
  PRIVATE_REGISTRY: {
    LIST: 'pci.projects.project.private-registry',
    ADD: 'pci.projects.project.private-registry.create',
  },
  WORKFLOW: {
    LIST: 'pci.projects.project.workflow',
    ADD: 'pci.projects.project.workflow.new',
  },
  NOTEBOOKS: {
    LIST: 'pci.projects.project.notebooks',
    ADD: 'pci.projects.project.notebooks.add',
  },
  TRAINING: {
    LIST: 'pci.projects.project.training',
    ADD: 'pci.projects.project.training.jobs.submit',
  },
  SERVING: {
    LIST: 'pci.projects.project.serving',
    ADD: 'pci.projects.project.serving.add',
  },
  DATA_PROCESSING: {
    LIST: 'pci.projects.project.data-processing.jobs',
    ADD: 'pci.projects.project.data-processing.jobs.submit-job',
  },
  PROJECT_MANAGEMENT: {
    QUOTA_AND_REGIONS: 'pci.projects.project.quota',
    SSH_KEYS: 'pci.projects.project.sshKeys',
    BILLING_CONTROL: 'pci.projects.project.billing',
    CREDIT_AND_VOUCHERS: 'pci.projects.project.vouchers',
    CONTACTS_AND_RIGHTS: 'pci.projects.project.contacts',
    PROJECT_SETTINGS: 'pci.projects.project.edit',
  },
};

export const ORDER_FOLLOW_UP_POLLING_INTERVAL = 7000;

export const ORDER_FOLLOW_UP_STATUS_ENUM = {
  DOING: 'DOING',
  DONE: 'DONE',
  ERROR: 'ERROR',
  TODO: 'TODO',
};

export const ORDER_FOLLOW_UP_STEP_ENUM = {
  AVAILABLE: 'AVAILABLE',
  DELIVERING: 'DELIVERING',
  VALIDATED: 'VALIDATED',
  VALIDATING: 'VALIDATING',
};

export const ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM = {
  FRAUD_DOCS_REQUESTED: 'FRAUD_DOCS_REQUESTED',
  FRAUD_MANUAL_REVIEW: 'FRAUD_MANUAL_REVIEW',
  FRAUD_REFUSED: 'FRAUD_REFUSED',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
};

export const ORDER_CHECK_PAYMENT_TIMEOUT_OVER =
  'ORDER_CHECK_PAYMENT_TIMEOUT_OVER';

export default {
  PCI_FEATURES,
  DEFAULT_PROJECT_KEY,
  QUOTA_THRESHOLD,
  ORDER_FOLLOW_UP_POLLING_INTERVAL,
  ORDER_FOLLOW_UP_STATUS_ENUM,
  ORDER_FOLLOW_UP_STEP_ENUM,
  ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM,
  ITALY_AGREEMENT_TEXT,
};
