export const CAPABILITIES = {
  VOLUME: 'volume',
  RESIZE: 'resize',
  SNAPSHOT: 'snapshot',
  FAIL_OVER_IP: 'failoverip',
};

/* TODO:
    1 - Add all missing instance status
    2 - Replace hardcoded status */
export const INSTANCE_STATUS = {
  SHELVED: 'SHELVED',
  SHELVED_OFFLOADED: 'SHELVED_OFFLOADED',
  SHELVING: 'SHELVING',
  UNSHELVING: 'UNSHELVING',
};

export default {
  INSTANCE_STATUS,
  CAPABILITIES,
};
