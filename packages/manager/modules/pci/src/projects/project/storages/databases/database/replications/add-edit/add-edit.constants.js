export const FORM_RULES = {
  topics: {
    pattern: /^[A-Za-z0-9-_.*?]+$/,
    min: 1,
    max: 1024,
  },
  blacklistedTopics: {
    pattern: /^[A-Za-z0-9-_.*?]+$/,
    min: 1,
    max: 1024,
  },
  editSyncInterval: {
    min: 1,
    max: 31536000,
  },
};
export const DEFAULT_VALUES = {
  editSyncInterval: 60,
  syncGroupOffset: false,
  heartbeat: true,
  status: true,
};
export const POLICIES = [
  'org.apache.kafka.connect.mirror.DefaultReplicationPolicy',
  'org.apache.kafka.connect.mirror.IdentityReplicationPolicy',
];
export default {
  FORM_RULES,
  DEFAULT_VALUES,
  POLICIES,
};
