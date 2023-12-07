export const CONNECTION_PROTOCOLS = [
  'rw_none',
  'rw_sftponly',
  'rw_active',
  'off_active',
  'off_sftponly',
  'off_none',
];

export const SSH_STATE = {
  ACTIVE: 'active',
  SFTPONLY: 'sftponly',
  NONE: 'none',
};

export const USER_STATE = {
  OFF: 'off',
  RW: 'rw',
};

export default {
  SSH_STATE,
  USER_STATE,
  CONNECTION_PROTOCOLS,
};
