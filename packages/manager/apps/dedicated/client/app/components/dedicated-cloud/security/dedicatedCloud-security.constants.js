export const VM_ENCRYPTION_KMS = {
  regex: {
    ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    sslThumbprint: /^(((([0-9]|[a-fA-F]){2}:){19})|((([0-9]|[a-fA-F]){2}:){31}))([0-9]|[a-fA-F]){2}$/,
  },
  creationTaskWaitingConfiguration:
    'Waiting for customer to configure the KMS Server...',
  waitingStatus: ['doing', 'todo'],
  endStatus: ['canceled', 'done'],
  pollingDelay: 2000,
};

export default {
  VM_ENCRYPTION_KMS,
};
