export const DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME =
  'EXCHANGE_ACCOUNT_HOME_DATAGRID_COLUMN_PARAMETERS';

export const ACCOUNT_PHONE_RULE_NAME = 'phoneCountry';
export const ACCOUNT_COUNTRY_RULE_NAME = 'country';

export const ACCOUNT_WORLD_PHONE_REGEX = /^\S+$/;

export const ACCOUNT_EMAIL_ADDRESS_REGEX = /^(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)(?:(?:\.|\+)(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*))*$/;

/**
 * Legacy
 * @see MANAGER-8716
 */
export const unescapeDescription = (description) =>
  typeof description === 'string' ? description.replace(/^"+|"+$/g, '') : null;

export const ACCOUNT_PROPERTIES_WITH_UNIT = ['totalQuota', 'usedQuota'];
export const ACCOUNT_PROPERTIES_WITH_STATUS = ['mfa'];

export const OVH_MAIL_MIGRATOR_URL = 'https://omm.ovh.net/';

export default {
  DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME,
  ACCOUNT_PHONE_RULE_NAME,
  ACCOUNT_COUNTRY_RULE_NAME,
  ACCOUNT_WORLD_PHONE_REGEX,
  ACCOUNT_PROPERTIES_WITH_UNIT,
  ACCOUNT_PROPERTIES_WITH_STATUS,
  unescapeDescription,
  OVH_MAIL_MIGRATOR_URL,
};
