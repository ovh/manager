export const GUIDE_FEDERATION = {
  DEFAULT: 'https://docs.ovh.com/gb/en/private-cloud/federation/',
  ASIA: 'https://docs.ovh.com/asia/en/private-cloud/federation/',
  DE: 'https://docs.ovh.com/de/private-cloud/federation/',
  ES: 'https://docs.ovh.com/es/private-cloud/federation/',
  IE: 'https://docs.ovh.com/ie/en/private-cloud/federation/',
  IT: 'https://docs.ovh.com/it/private-cloud/federation/',
  PL: 'https://docs.ovh.com/pl/private-cloud/federation/',
  PT: 'https://docs.ovh.com/pt/private-cloud/federation/',
  GB: 'https://docs.ovh.com/gb/en/private-cloud/federation/',
  CA: 'https://docs.ovh.com/ca/en/private-cloud/federation/',
  QC: 'https://docs.ovh.com/ca/fr/private-cloud/federation/',
  AU: 'https://docs.ovh.com/au/en/private-cloud/federation/',
  SG: 'https://docs.ovh.com/sg/en/private-cloud/federation/',
  FR: 'https://docs.ovh.com/fr/private-cloud/federation/',
  WE: 'https://docs.ovh.com/us/en/private-cloud/federation/',
  WS: 'https://docs.ovh.com/us/es/private-cloud/federation/',
  US: 'https://docs.ovh.com/us/en/private-cloud/federation/',
};

export const PLACEHOLDER = {
  userName: 'vcenterbind@example.com',
  domainName: 'example.com',
  description: 'Example Active Directory',
  domainAlias: 'example',
  baseDnForUsers: 'cn=Users,dc=example,dc=com',
  baseDnForGroups: 'cn=Groups,dc=example,dc=com',
  sslThumbprint: 'BB:46:CA:6B:FC:92:4E:96:B4:BB:6E:44:7E:8F:AD:4C:C9:32:AB:AB',
  ldapHostname: 'ad.example.com',
  password: '************',
  ldapTcpPort: '636',
  ip: '203.0.113.78',
};

const FIELD = 'Field';

export const FIELD_NAME = {
  userName: `userName${FIELD}`,
  domainName: `domainName${FIELD}`,
  description: `description${FIELD}`,
  domainAlias: `domainAlias${FIELD}`,
  baseDnForUsers: `baseDnForUsers${FIELD}`,
  baseDnForGroups: `baseDnForGroups${FIELD}`,
  sslThumbprint: `sslThumbprint${FIELD}`,
  ldapHostname: `ldapHostname${FIELD}`,
  password: `password${FIELD}`,
  ldapTcpPort: `ldapTcpPort${FIELD}`,
  ip: `ip${FIELD}`,
};

export const DEFAULT_LDAP_TCP_PORT = 636;

export const TRACKING_PREFIX = 'add-active-directory';

export const TRACKING_TASK_TAG = {
  done: `${TRACKING_PREFIX}-success`,
  error: `${TRACKING_PREFIX}-error`,
  canceled: `${TRACKING_PREFIX}-canceled`,
};

export default {
  DEFAULT_LDAP_TCP_PORT,
  FIELD_NAME,
  GUIDE_FEDERATION,
  PLACEHOLDER,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
};
