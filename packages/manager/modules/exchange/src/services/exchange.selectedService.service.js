export default class ExchangeSelectedService {
  /* @ngInject */
  constructor(exchangeServiceInfrastructure, exchangeVersion, $translate) {
    this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
    this.exchangeVersion = exchangeVersion;
    this.$translate = $translate;

    /**
     * Enum for account creation methods
     * @readonly
     * @enum {string}
     * @typedef {object} ExchangeAccountCreationMethods
     */
    this.ACCOUNT_CREATION_METHODS = {
      ADDING: this.$translate.instant('exchange_accountCreationMethods_adding'),
      ORDERING: this.$translate.instant(
        'exchange_accountCreationMethods_ordering',
      ),
    };

    /**
     * Enum for contract types
     * @readonly
     * @enum {ExchangeAccountCreationMethods}
     * @typedef {object} ExchangeServiceContractTypes
     */
    this.CONTRACT_TYPES = {
      /**
       * Prepaid contract services can order new empty (configureme.me) accounts
       */
      PREPAID: {
        displayValue: this.$translate.instant('exchange_contractTypes_prepaid'),
        accountCreationMethod: this.ACCOUNT_CREATION_METHODS.ADDING,
      },

      /**
       * Pay as you go services can add new functionnal (not configureme.me) accounts
       */
      PAY_AS_YOU_GO: {
        displayValue: this.$translate.instant(
          'exchange_contractTypes_payAsYouGo',
        ),
        accountCreationMethod: this.ACCOUNT_CREATION_METHODS.ORDERING,
      },
    };
  }

  /**
   * @returns {ExchangeServiceContractTypes} The contract type the current service is linked to
   */
  getContractType() {
    return this.exchangeServiceInfrastructure.isHosted() ||
      (this.exchangeServiceInfrastructure.isProvider() &&
        this.exchangeVersion.isAfter(2010))
      ? this.CONTRACT_TYPES.PREPAID
      : this.CONTRACT_TYPES.PAY_AS_YOU_GO;
  }

  /**
   * @param {ExchangeServiceContractTypes} contractType
   * @returns {boolean} True if the current service uses the same contract type as `contractType`
   */
  isContractType(contractType) {
    return this.getContractType().displayValue === contractType.displayValue;
  }

  /**
   * @returns {boolean} True if the current service allows accounts to be upgraded to 300 Gb
   */
  canUpgradeTo300Gb() {
    return (
      this.exchangeServiceInfrastructure.isHosted() ||
      (this.exchangeServiceInfrastructure.isProvider() &&
        this.exchangeVersion.isAfter(2010))
    );
  }

  isMfaAvailable() {
    return (
      (this.exchangeServiceInfrastructure.isHosted() ||
        this.exchangeServiceInfrastructure.isProvider() ||
        this.exchangeServiceInfrastructure.isDedicated()) &&
      this.exchangeVersion.isAfter(2010)
    );
  }
}
