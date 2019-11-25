angular.module('Module.exchange.services').service(
  'exchangeAccount',
  class ExchangeAccount {
    constructor(
      Exchange,
      exchangeAccountTypes,
      exchangeServiceInfrastructure,
      exchangeSelectedService,
      exchangeStates,
      exchangeVersion,
      OvhHttp,
    ) {
      this.Exchange = Exchange;
      this.exchangeAccountTypes = exchangeAccountTypes;
      this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
      this.exchangeSelectedService = exchangeSelectedService;
      this.exchangeStates = exchangeStates;
      this.exchangeVersion = exchangeVersion;
      this.OvhHttp = OvhHttp;

      this.EVENTS = {
        CHANGE_STATE: 'exchange.account.CHANGE_STATE',
      };

      this.PLACEHOLDER_DOMAIN_NAME = 'configureme.me';

      this.CAN_DO = {
        CREATION_METHOD: {
          ADDING: () => this.exchangeServiceInfrastructure.isDedicated()
            || this.exchangeServiceInfrastructure.isDedicatedCluster()
            || (this.exchangeServiceInfrastructure.isProvider() && this.exchangeVersion.is(2010)),
          ORDERING: () => this.exchangeServiceInfrastructure.isHosted()
            || (this.exchangeServiceInfrastructure.isProvider() && !this.exchangeVersion.is(2010)),
        },
        DESTRUCTION_METHOD: {
          DELETING: () => this.exchangeServiceInfrastructure.isDedicated()
            || this.exchangeServiceInfrastructure.isDedicatedCluster()
            || (this.exchangeServiceInfrastructure.isProvider() && this.exchangeVersion.is(2010)),
          RESETTING: () => this.exchangeServiceInfrastructure.isHosted()
            || (this.exchangeServiceInfrastructure.isProvider() && !this.exchangeVersion.is(2010)),
        },
        UPGRADE_TO_300_GB: () => this.exchangeServiceInfrastructure.isHosted()
          || (this.exchangeServiceInfrastructure.isProvider()
            && this.exchangeVersion.isAfter(2010)),
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
      return this.OvhHttp.post(
        `/email/exchange/${organizationName}/service/${serviceName}/account`,
        {
          rootPath: 'apiv6',
          data: newAccount,
        },
      ).then((data) => {
        this.Exchange.refreshViews('Accounts', 'Tasks');

        return data;
      });
    }

    /**
     * @param {string} serviceName
     * @param {object} userPrincipalName
     */
    createMfa(serviceName, userPrincipalName) {
      return this.OvhHttp.post(
        `/msServices/${serviceName}/account/${userPrincipalName}/mfa`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    /**
     * @param {string} serviceName
     * @param {object} userPrincipalName
     */
    enableMfa(serviceName, userPrincipalName) {
      return this.OvhHttp.post(
        `/msServices/${serviceName}/account/${userPrincipalName}/mfa/enable`,
        {
          rootPath: 'apiv6',
          broadcast: this.Exchange.events.accountsChanged,
        },
      );
    }

    /**
     * @param {string} serviceName
     * @param {object} userPrincipalName
     */
    deleteMfa(serviceName, userPrincipalName) {
      return this.OvhHttp.delete(
        `/msServices/${serviceName}/account/${userPrincipalName}/mfa`,
        {
          rootPath: 'apiv6',
          broadcast: this.Exchange.events.accountsChanged,
        },
      );
    }

    /**
     * @param {string} serviceName
     * @param {object} userPrincipalName
     */
    disableMfa(serviceName, userPrincipalName, period) {
      return this.OvhHttp.post(
        `/msServices/${serviceName}/account/${userPrincipalName}/mfa/disable`,
        {
          rootPath: 'apiv6',
          data: {
            period,
          },
          broadcast: this.Exchange.events.accountsChanged,
        },
      );
    }

    /**
     * @param {string} serviceName
     * @param {object} userPrincipalName
     */
    resetMfa(serviceName, userPrincipalName) {
      return this.OvhHttp.post(
        `/msServices/${serviceName}/account/${userPrincipalName}/mfa/reset`,
        {
          rootPath: 'apiv6',
          broadcast: this.Exchange.events.accountsChanged,
        },
      );
    }

    /**
     * @param {object} account
     * @returns {boolean} True if the account can be edited
     */
    isEditable(account) {
      return (
        this.exchangeStates.constructor.isOk(account)
        || this.exchangeStates.constructor.isDoing(account)
        || this.exchangeStates.constructor.isInError(account)
      );
    }

    /**
     * @param {object} account
     * @returns {boolean} True if the `account` can't be used as it is a placeholder
     *                    and not an actual account
     */
    isPlaceholder(account) {
      const inputIsValid = _(account)
        .chain()
        .get('domain')
        .isString()
        .value();

      if (!inputIsValid) {
        throw new Error('Input is not a valid account');
      }

      return account.domain.toUpperCase() === this.PLACEHOLDER_DOMAIN_NAME.toUpperCase();
    }
  },
);
