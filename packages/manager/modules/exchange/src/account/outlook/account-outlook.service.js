import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';

export default class ExchangeAccountOutlook {
  /* @ngInject */
  constructor(
    wucExchange,
    exchangeAccount,
    exchangeAccountTypes,
    exchangeSelectedService,
    OvhHttp,
  ) {
    this.wucExchange = wucExchange;
    this.exchangeAccount = exchangeAccount;
    this.exchangeAccountTypes = exchangeAccountTypes;
    this.exchangeSelectedService = exchangeSelectedService;
    this.OvhHttp = OvhHttp;

    this.STATES = {
      ALREADY_ORDERED: 'ALREADY_ORDERED',
      ALREADY_ACTIVATED: 'ALREADY_ACTIVATED',
      TO_ACTIVATE: 'TO_ACTIVATE',
      TO_ORDER: 'TO_ORDER',
      CANT_ORDER_OR_ACTIVATE_LICENSE: 'CANT_ORDER_OR_ACTIVATE_LICENSE',
    };
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {object} model
   */
  generateOutlookUrl(organizationName, serviceName, model) {
    return this.OvhHttp.post(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${model.primaryEmailAddress}/outlookURL`,
      {
        rootPath: 'apiv6',
        data: {
          version: model.licenceVersion,
          language: model.language.toLowerCase(),
        },
      },
    ).then((response) => {
      this.wucExchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  getLicenceDetails(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.get(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${primaryEmailAddress}/outlookURL`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  getLicenceOptions(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.get(
      `/sws/exchange/${organizationName}/${serviceName}/${primaryEmailAddress}/license/options`,
      {
        rootPath: '2api',
      },
    );
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {object} model
   */
  orderOutlook(organizationName, serviceName, model) {
    return this.OvhHttp.post(
      `/order/email/exchange/${organizationName}/service/${serviceName}/outlook/${model.duration}`,
      {
        rootPath: 'apiv6',
        data: {
          licence: model.licenceVersion,
          primaryEmailAddress: model.primaryEmailAddress,
        },
      },
    ).then((response) => {
      this.wucExchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {object} model
   */
  activateOutlook(organizationName, serviceName, model) {
    const data = {
      outlookLicense: true,
      primaryEmailAddress: model.primaryEmailAddress,
    };

    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${model.primaryEmailAddress}`,
      {
        rootPath: 'apiv6',
        data,
      },
    ).then((response) => {
      this.wucExchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  delete(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${primaryEmailAddress}`,
      {
        rootPath: 'apiv6',
        data: {
          deleteOutlookAtExpiration: true,
        },
      },
    ).then((response) => {
      this.wucExchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  deactivate(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${primaryEmailAddress}`,
      {
        rootPath: 'apiv6',
        data: {
          outlookLicense: false,
        },
      },
    ).then((response) => {
      this.wucExchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * Accounts can have Outlook license if is not a placeholder account
   * and if its type allows having an Outlook license
   * @param {object} account
   * @returns {boolean} True if the `account` can have an Outlook license
   */
  canHaveLicense(account) {
    return (
      !this.exchangeAccountTypes.is(
        account,
        this.exchangeAccountTypes.TYPES.BASIC,
      ) && !this.exchangeAccount.isPlaceholder(account)
    );
  }

  /**
   * The status tells if the current user can order a license and if he needs to
   * @param {object} account
   * @returns {string} Status of the `account` Outlook license
   */
  getStatus(account) {
    const inputIsValid = isBoolean(get(account, 'outlook'));

    if (!inputIsValid) {
      throw new Error('Input is not a valid account');
    }

    const accountAlreadyHasLicence = account.outlook;

    if (accountAlreadyHasLicence) {
      if (
        this.exchangeSelectedService.isContractType(
          this.exchangeSelectedService.CONTRACT_TYPES.PREPAID,
        )
      ) {
        return this.STATES.ALREADY_ORDERED;
      }

      return this.STATES.ALREADY_ACTIVATED;
    }

    if (!this.wucExchange.currentUserHasConfigurationRights()) {
      return this.STATES.CANT_ORDER_OR_ACTIVATE_LICENSE;
    }

    if (
      this.exchangeSelectedService.isContractType(
        this.exchangeSelectedService.CONTRACT_TYPES.PAY_AS_YOU_GO,
      )
    ) {
      return this.STATES.TO_ACTIVATE;
    }

    return this.STATES.TO_ORDER;
  }

  /**
   * @param {object} account
   * @param {string} status
   * @returns {boolean} True if the `account` status matches the input `status`
   */
  hasStatus(account, status) {
    return this.getStatus(account) === status;
  }
}
