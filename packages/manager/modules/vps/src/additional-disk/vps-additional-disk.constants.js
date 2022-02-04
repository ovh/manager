export const VPS_DISK_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  PENDING: 'pending',
};

export const VPS_DISK_STATES = {
  ERROR: [VPS_DISK_STATUS.DISCONNECTED],
  WARNING: [VPS_DISK_STATUS.PENDING],
  SUCCESS: [VPS_DISK_STATUS.CONNECTED],
};

export default {
  VPS_DISK_STATES,
};
