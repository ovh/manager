export const DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME =
  'EXCHANGE_ACCOUNT_HOME_DATAGRID_COLUMN_PARAMETERS';

export const ACCOUNT_PHONE_RULE_NAME = 'phoneCountry';
export const ACCOUNT_COUNTRY_RULE_NAME = 'country';

export const ACCOUNT_WORLD_PHONE_REGEX = /^00\d{2,3}[\s\d]+$/;

export const escapeDescription = (description) =>
  typeof description === 'string' && description.length > 0
    ? `"${description}"`
    : null;

export const unescapeDescription = (description) =>
  typeof description === 'string' ? description.replace(/^"+|"+$/g, '') : null;

export default {
  DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME,
  ACCOUNT_PHONE_RULE_NAME,
  ACCOUNT_COUNTRY_RULE_NAME,
  ACCOUNT_WORLD_PHONE_REGEX,
  escapeDescription,
  unescapeDescription,
};
