export const MONTHLY_STRATEGY = 'ping';

const BASE_URL = '/pci/projects/:serviceName';

export const PRODUCT_MAPPING = {
  instance: `${BASE_URL}/instances`,
  snapshot: {
    'volume.snapshot.consumption': `${BASE_URL}/storages/volume-snapshots`,
    'snapshot.consumption': `${BASE_URL}/storages/instance-backups`,
  },
  volume: {
    'volume.classic.consumption': `${BASE_URL}/storages/blocks`,
  },
  'ai-training': `${BASE_URL}/training/jobs`,
  'ai-serving-engine': `${BASE_URL}/serving`,
  databases: `${BASE_URL}/storages/databases`,
  'data-processing-job': `${BASE_URL}/data-processing`,
};

export default {
  MONTHLY_STRATEGY,
  PRODUCT_MAPPING,
};
