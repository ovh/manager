export const DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME =
  'EXCHANGE_ACCOUNT_HOME_DATAGRID_COLUMN_PARAMETERS';

export const ACCOUNT_PHONE_RULE_NAME = 'phoneCountry';
export const ACCOUNT_COUNTRY_RULE_NAME = 'country';

export const ACCOUNT_WORLD_PHONE_REGEX = /^00\d{2,3}[\s\d]+$/;

export const ACCOUNT_EMAIL_ADDRESS_REGEX = /^(?:[a-z0-9]+(?:[-_][a-z0-9]+)*)(?:(?:\.|\+)(?:[a-z0-9]+(?:[-_][a-z0-9]+)*))*$/;

/**
 * Legacy
 * @see MANAGER-8716
 */
export const unescapeDescription = (description) =>
  typeof description === 'string' ? description.replace(/^"+|"+$/g, '') : null;

export const ACCOUNT_PROPERTIES_WITH_UNIT = ['totalQuota', 'usedQuota'];
export const ACCOUNT_PROPERTIES_WITH_STATUS = ['mfa'];

export default {
  DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME,
  ACCOUNT_PHONE_RULE_NAME,
  ACCOUNT_COUNTRY_RULE_NAME,
  ACCOUNT_WORLD_PHONE_REGEX,
  ACCOUNT_PROPERTIES_WITH_UNIT,
  ACCOUNT_PROPERTIES_WITH_STATUS,
  unescapeDescription,
};
