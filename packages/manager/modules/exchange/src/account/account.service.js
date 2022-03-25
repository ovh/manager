import get from 'lodash/get';
import isString from 'lodash/isString';

import {
  ACCOUNT_PROPERTIES_WITH_UNIT,
  ACCOUNT_PROPERTIES_WITH_STATUS,
} from './account.constants';

export default class ExchangeAccount {
  /* @ngInject */
  constructor(
    $http,
    wucExchange,
    exchangeAccountTypes,
    exchangeServiceInfrastructure,
    exchangeSelectedService,
    exchangeStates,
    exchangeVersion,
    OvhHttp,
    OvhApiMsServices,
  ) {
    this.$http = $http;

    this.wucExchange = wucExchange;
    this.exchangeAccountTypes = exchangeAccountTypes;
    this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
    this.exchangeSelectedService = exchangeSelectedService;
    this.exchangeStates = exchangeStates;
    this.exchangeVersion = exchangeVersion;
    this.OvhHttp = OvhHttp;
    this.OvhApiMsServices = OvhApiMsServices;

    this.EVENTS = {
      CHANGE_STATE: 'exchange.account.CHANGE_STATE',
    };

    this.PLACEHOLDER_DOMAIN_NAME = 'configureme.me';

    this.CAN_DO = {
      CREATION_METHOD: {
        ADDING: () =>
          this.exchangeServiceInfrastructure.isDedicated() ||
          this.exchangeServiceInfrastructure.isDedicatedCluster() ||
          (this.exchangeServiceInfrastructure.isProvider() &&
            this.exchangeVersion.is(2010)),
        ORDERING: () =>
          this.exchangeServiceInfrastructure.isHosted() ||
          (this.exchangeServiceInfrastructure.isProvider() &&
            !this.exchangeVersion.is(2010)),
      },
      DESTRUCTION_METHOD: {
        DELETING: () =>
          this.exchangeServiceInfrastructure.isDedicated() ||
          this.exchangeServiceInfrastructure.isDedicatedCluster() ||
          (this.exchangeServiceInfrastructure.isProvider() &&
            this.exchangeVersion.is(2010)),
        RESETTING: () =>
          this.exchangeServiceInfrastructure.isHosted() ||
          (this.exchangeServiceInfrastructure.isProvider() &&
            !this.exchangeVersion.is(2010)),
      },
      UPGRADE_TO_300_GB: () =>
        this.exchangeServiceInfrastructure.isHosted() ||
        (this.exchangeServiceInfrastructure.isProvider() &&
          this.exchangeVersion.isAfter(2010)),
    };
  }

  /**
   * Get an array of task id
   * @param  {string} primaryEmailAddress
   * @returns {Promise} [number]
   */
  getTasks(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.get(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${primaryEmailAddress}/tasks`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {object} newAccount
   */
  sendingNewAccount(organizationName, serviceName, newAccount) {
    return this.$http
      .post(
        `/email/exchange/${organizationName}/service/${serviceName}/account`,
        newAccount,
      )
      .then(({ data }) => data);
  }

  /**
   * @param {string} serviceName
   * @param {object} userPrincipalName
   */
  createMfa(serviceName, userPrincipalName) {
    return this.OvhApiMsServices.Account()
      .Mfa()
      .v6()
      .create(
        {
          serviceName,
          userPrincipalName,
        },
        {},
      )
      .$promise.then((data) => {
        this.wucExchange.refreshViews('Accounts', 'Tasks');
        return data;
      });
  }

  /**
   * @param {string} serviceName
   * @param {object} userPrincipalName
   */
  enableMfa(serviceName, userPrincipalName) {
    return this.OvhApiMsServices.Account()
      .Mfa()
      .v6()
      .enable(
        {
          serviceName,
          userPrincipalName,
        },
        {},
      )
      .$promise.then((data) => {
        this.wucExchange.refreshViews('Accounts', 'Tasks');
        return data;
      });
  }

  /**
   * @param {string} serviceName
   * @param {object} userPrincipalName
   */
  deleteMfa(serviceName, userPrincipalName) {
    return this.OvhApiMsServices.Account()
      .Mfa()
      .v6()
      .delete(
        {
          serviceName,
          userPrincipalName,
        },
        {},
      )
      .$promise.then((data) => {
        this.wucExchange.refreshViews('Accounts', 'Tasks');
        return data;
      });
  }

  /**
   * @param {string} serviceName
   * @param {object} userPrincipalName
   */
  disableMfa(serviceName, userPrincipalName, period) {
    return this.OvhApiMsServices.Account()
      .Mfa()
      .v6()
      .disable(
        {
          serviceName,
          userPrincipalName,
        },
        {
          period,
        },
      )
      .$promise.then((data) => {
        this.wucExchange.refreshViews('Accounts', 'Tasks');
        return data;
      });
  }

  /**
   * @param {string} serviceName
   * @param {object} userPrincipalName
   */
  resetMfa(serviceName, userPrincipalName) {
    return this.OvhApiMsServices.Account()
      .Mfa()
      .v6()
      .reset(
        {
          serviceName,
          userPrincipalName,
        },
        {},
      )
      .$promise.then((data) => {
        this.wucExchange.refreshViews('Accounts', 'Tasks');
        return data;
      });
  }

  createMfaOnAllAccount(serviceName) {
    return this.OvhApiMsServices.v6()
      .createMfaOnAllUsers(
        {
          serviceName,
        },
        {},
      )
      .$promise.then((data) => {
        this.wucExchange.refreshViews('Accounts', 'Tasks');
        return data;
      });
  }

  deleteMfaOnAllAccounts(serviceName) {
    return this.OvhApiMsServices.v6()
      .removeMfaOnAllUsers(
        {
          serviceName,
        },
        {},
      )
      .$promise.then((data) => {
        this.wucExchange.refreshViews('Accounts', 'Tasks');
        return data;
      });
  }

  /**
   * @param {object} account
   * @returns {boolean} True if the account can be edited
   */
  isEditable(account) {
    return (
      this.exchangeStates.constructor.isOk(account) ||
      this.exchangeStates.constructor.isDoing(account) ||
      this.exchangeStates.constructor.isInError(account)
    );
  }

  /**
   * @param {object} account
   * @returns {boolean} True if the `account` can't be used as it is a placeholder
   *                    and not an actual account
   */
  isPlaceholder(account) {
    const inputIsValid = isString(get(account, 'domain'));

    if (!inputIsValid) {
      throw new Error('Input is not a valid account');
    }

    return (
      account.domain.toUpperCase() ===
      this.PLACEHOLDER_DOMAIN_NAME.toUpperCase()
    );
  }

  /**
   * Get account rules field.
   * Can be used to build a country codes list
   * @returns {Promise} rules: fields rules info
   */
  getAccountRules() {
    return this.$http
      .post('/newAccount/rules')
      .then(({ data: rules }) => rules);
  }

  accountValueToCSVString = (value) => {
    const toStringMap = {
      String: (v) => v,
      Number: (v) => `${v}`,
      Boolean: (v) => `${v}`,
      Undefined: () => '',
      Null: () => '',
      Object: (v) => toStringMap.Array(Object.values(v)),
      Array: (v) => v.map(this.accountValueToCSVString).join(','),
      Date: (v) => v.toISOString(),
    };
    const type = Object.prototype.toString.call(value).match(/ (.+?)\]$/)[1];
    const method = toStringMap[type] || toStringMap.String;
    return method(value);
  };

  accountToCSVString = (account, properties, separator) =>
    properties
      .map((property) => {
        let accountValue = account[property];
        if (ACCOUNT_PROPERTIES_WITH_UNIT.includes(property)) {
          accountValue = account[property].value + account[property].unit;
        } else if (ACCOUNT_PROPERTIES_WITH_STATUS.includes(property)) {
          accountValue = account[property].status;
        }
        return this.accountValueToCSVString(accountValue);
      })
      .map((value) => (value ? `"${value.replace(/[\r\n]/g, '')}"` : ''))
      .join(separator);
}
