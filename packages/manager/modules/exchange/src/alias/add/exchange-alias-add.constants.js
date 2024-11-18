export const ALIAS_TYPE = {
  SMTP: 'smtp',
  X500: 'x500',
  email: 'ACCOUNT',
  group: 'MAILING_LIST',
  shared: 'SHARED_ACCOUNT',
};

export const SMTP_FIELD_LABEL = 'SMTP (standard)';

export const X500_PREFIX = 'X500:/O=';

export const X500_REGEX = /^[^\s@]+\/OU=EXCHANGE ADMINISTRATIVE GROUP \(FYDIBOHF23SPDLT\)\/CN=RECIPIENTS\/CN=[^\s@]+$/gi;

export default {
  ALIAS_TYPE,
  X500_PREFIX,
  X500_REGEX,
};
