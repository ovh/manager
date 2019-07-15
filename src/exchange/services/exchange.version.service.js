angular.module('Module.exchange.services').service(
  'exchangeVersion',
  class ExchangeVersion {
    constructor(Exchange) {
      this.services = { Exchange };

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
    isVersion(versionNumber, exchange = this.services.Exchange.getValue()) {
      const isMatchingVersion = _(
        exchange.serverDiagnostic.commercialVersion,
      ).includes(versionNumber);

      return isMatchingVersion;
    }

    is(versionNumber) {
      return this.isVersion(versionNumber);
    }

    /**
     * @param {(string|number)} versionNumberToCompareTo
     *                          Version to compare current Exchange account to
     */
    isAfter(versionNumberToCompareTo, exchange = this.services.Exchange.getValue()) {
      const currentVersionNumber = exchange.serverDiagnostic.version;

      const propertyName = `v${versionNumberToCompareTo}`;
      const versionNumberToCompare = this[propertyName];

      return versionNumberToCompare < currentVersionNumber;
    }

    /**
     * @param {(string|number)} versionNumberToCompareTo
     *                          Version to compare current Exchange account to
     */
    isBefore(versionNumberToCompareTo, exchange = this.services.Exchange.getValue()) {
      const currentVersionNumber = exchange.serverDiagnostic.version;

      const propertyName = `v${versionNumberToCompareTo}`;
      const versionNumberToCompare = this[propertyName];

      return versionNumberToCompare > currentVersionNumber;
    }
  },
);
