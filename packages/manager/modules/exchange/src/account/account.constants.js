export const DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME =
  'EXCHANGE_ACCOUNT_HOME_DATAGRID_COLUMN_PARAMETERS';

export const ACCOUNT_PHONE_RULE_NAME = 'phoneCountry';
export const ACCOUNT_COUNTRY_RULE_NAME = 'country';

export const ACCOUNT_WORLD_PHONE_REGEX = /^00\d{2,3}[\s\d]+$/;

/**
 * Legacy
 * @see MANAGER-8716
 */
export const unescapeDescription = (description) =>
  typeof description === 'string' ? description.replace(/^"+|"+$/g, '') : null;

const accountPropertiesWithUnit = ['totalQuota', 'usedQuota'];
const accountPropertiesWithStatus = ['mfa'];

const accountValueToCSVString = (value) => {
  const toStringMap = {
    String: (v) => v,
    Number: (v) => `${v}`,
    Boolean: (v) => `${v}`,
    Undefined: () => '',
    Null: () => '',
    Object: (v) => toStringMap.Array(Object.values(v)),
    Array: (v) => v.map(accountValueToCSVString).join(','),
    Date: (v) => v.toISOString(),
  };
  const type = Object.prototype.toString.call(value).match(/ (.+?)\]$/)[1];
  const method = toStringMap[type] || toStringMap.String;
  return method(value);
};

export const accountToCSVString = (account, properties, separator) =>
  properties
    .map((property) => {
      let accountValue = account[property];
      if (accountPropertiesWithUnit.includes(property)) {
        accountValue = account[property].value + account[property].unit;
      } else if (accountPropertiesWithStatus.includes(property)) {
        accountValue = account[property].status;
      }
      return accountValueToCSVString(accountValue);
    })
    .map((value) => (value ? `"${value.replace(/[\r\n]/g, '')}"` : ''))
    .join(separator);

export default {
  DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME,
  ACCOUNT_PHONE_RULE_NAME,
  ACCOUNT_COUNTRY_RULE_NAME,
  ACCOUNT_WORLD_PHONE_REGEX,
  accountToCSVString,
  unescapeDescription,
};
