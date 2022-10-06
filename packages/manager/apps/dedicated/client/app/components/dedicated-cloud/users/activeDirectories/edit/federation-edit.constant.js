export const PLACEHOLDER = {
  userName: 'vcenterbind@example.com',
  description: 'Example Active Directory',
  sslThumbprint: 'BB:46:CA:6B:FC:92:4E:96:B4:BB:6E:44:7E:8F:AD:4C:C9:32:AB:AB',
  password: '************',
};

const FIELD = 'Field';

export const FIELD_NAME = {
  userName: `userName${FIELD}`,
  description: `description${FIELD}`,
  sslThumbprint: `sslThumbprint${FIELD}`,
  password: `password${FIELD}`,
};

export const TRACKING_PREFIX = 'update-active-directory';

export const TRACKING_TASK_TAG = {
  done: `${TRACKING_PREFIX}-success`,
  error: `${TRACKING_PREFIX}-error`,
};

export default {
  FIELD_NAME,
  PLACEHOLDER,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
};
