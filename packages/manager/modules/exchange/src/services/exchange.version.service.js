import includes from 'lodash/includes';

export default class ExchangeVersion {
  /* @ngInject */
  constructor(wucExchange) {
    this.services = { wucExchange };

    this.v4 = 4;
    this.v5 = 5;
    this.v55 = 5.5;
    this.v2000 = 6;
    this.v2003 = 6.5;
    this.v2007 = 8;
    this.v2010 = 14;
    this.v2013 = 15;
    this.v2016 = 15; // Is actually 15.1 for Microsoft but we use 15 somehow
  }

  /**
   * @param {(string|number)} versionNumber - Version to test
   */
  isVersion(versionNumber, exchange = this.services.wucExchange.getValue()) {
    const isMatchingVersion = includes(
      exchange.serverDiagnostic.commercialVersion,
      versionNumber,
    );

    return isMatchingVersion;
  }

  is(versionNumber) {
    return this.isVersion(versionNumber);
  }

  /**
   * @param {(string|number)} versionNumberToCompareTo
   *                          Version to compare current wucExchange account to
   */
  isAfter(
    versionNumberToCompareTo,
    exchange = this.services.wucExchange.getValue(),
  ) {
    const currentVersionNumber = exchange.serverDiagnostic.version;

    const propertyName = `v${versionNumberToCompareTo}`;
    const versionNumberToCompare = this[propertyName];

    return versionNumberToCompare < currentVersionNumber;
  }

  /**
   * @param {(string|number)} versionNumberToCompareTo
   *                          Version to compare current wucExchange account to
   */
  isBefore(
    versionNumberToCompareTo,
    exchange = this.services.wucExchange.getValue(),
  ) {
    const currentVersionNumber = exchange.serverDiagnostic.version;

    const propertyName = `v${versionNumberToCompareTo}`;
    const versionNumberToCompare = this[propertyName];

    return versionNumberToCompare > currentVersionNumber;
  }
}
