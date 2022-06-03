export const DEFAULT_PROJECT_KEY = 'PUBLIC_CLOUD_DEFAULT_PROJECT';
export const QUOTA_THRESHOLD = 80;

export const PCI_FEATURES = {
  PRODUCTS: {
    INSTANCE: 'instance',
    BAREMETAL: 'pci-baremetal',
    BLOCK_STORAGE: 'block-storage',
    OBJECT_STORAGE: 'object-storage',
    DATABASES: 'databases',
    SNAPSHOT: 'snapshot',
    CLOUD_ARCHIVE: 'archive',
    INSTANCE_BACKUP: 'instance-backup',
    LOAD_BALANCER: 'load-balancer',
    PRIVATE_NETWORK: 'private-network',
    FAILOVER_IP: 'failover-ip',
    ADDITIONAL_IP: 'public-cloud:additional-ips',
    KUBERNETES: 'kubernetes',
    PRIVATE_REGISTRY: 'private-registry',
    WORKFLOW_MANAGEMENT: 'workflow-management',
    NOTEBOOKS: 'notebooks',
    AI_APPS: 'ai-apps',
    TRAINING: 'training',
    SERVING: 'serving',
    ANALYTICS_DATA_PLATFORM: 'analytics-data-platform',
    DATA_PROCESSING: 'data-processing',
    LOGS_DATA_PLATFORM: 'logs-data-platform',
    HORIZON: 'horizon',
  },
  INSTANCE_FLAVORS_CATEGORY: {
    GENERAL: 'instance:flavors-category-general',
    CPU: 'instance:flavors-category-cpu',
    RAM: 'instance:flavors-category-ram',
    GPU: 'instance:flavors-category-gpu',
    SANDBOX: 'instance:flavors-category-sandbox',
    DISCOVERY: 'instance:flavors-category-discovery',
    IOPS: 'instance:flavors-category-iops',
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
  OTHERS: {
    PUBLIC_CLOUD: 'public-cloud',
    CREATE_PROJECT: 'public-cloud:create-project',
    HDS: 'public-cloud:hds',
    TRUSTED_ZONE: 'public-cloud:trusted-zone',
  },
};

export const PCI_FEATURES_STATES = {
  COMPUTE: {
    INSTANCES: 'pci.projects.project.instances',
    BAREMETAL: 'pci.projects.project.baremetal',
  },
  STORAGE: {
    BLOCK: 'pci.projects.project.storages.blocks',
    OBJECT: 'pci.projects.project.storages.object-storage',
    DATABASE: 'pci.projects.project.storages.databases',
    CLOUD_ARCHIVE: 'pci.projects.project.storages.archives',
    VOLUME_SNAPSHOT: 'pci.projects.project.storages.snapshots',
    INSTANCE_BACKUP: 'pci.projects.project.storages.instance-backups',
  },
  NETWORK: {
    LOAD_BALANCER: 'pci.projects.project.loadbalancer',
    PRIVATE_NETWORK: 'pci.projects.project.privateNetwork',
    FAILOVER_IP: 'pci.projects.project.failover-ips',
  },
  CONTAINERS_ORCHESTRATION: {
    MANAGED_KUBERNETES_SERVICE: 'pci.projects.project.kubernetes',
    MANAGED_PRIVATE_REGISTRY: 'pci.projects.project.private-registry',
    WORKFLOW_MANAGEMENT: 'pci.projects.project.workflow',
  },
  AI_ML: {
    NOTEBOOKS: 'pci.projects.project.notebooks',
    TRAINING: 'pci.projects.project.ai.training',
    APPS: 'pci.projects.project.ai.apps',
    ALPHA: 'pci.projects.project.ai',
    SERVING: 'pci.projects.project.ai.serving',
  },
  DATA_ANALYTICS: {
    DATA_PROCESSING: 'pci.projects.project.data-processing',
  },
  PROJECT_MANAGEMENT: {
    USERS_ROLES: 'pci.projects.project.users',
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
};
