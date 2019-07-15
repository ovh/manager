angular.module('Module.exchange.services').service(
  'exchangeServiceInfrastructure',
  class ExchangeServiceInfrastructure {
    constructor(Exchange, exchangeVersion) {
      this.Exchange = Exchange;
      this.exchangeVersion = exchangeVersion;

      this.INFRASTRUCTURES = {
        HOSTED: 'Hosted',
        PROVIDER: 'Provider',
        DEDICATED: 'Dedicated',
        DEDICATED_CLUSTER: 'DedicatedCluster',
      };
    }

    isType(infrastructure, exchange = this.Exchange.getValue()) {
      if (_(`${infrastructure}`).isEmpty()) {
        throw new Error("Can't work with empty input");
      }

      return (
        _(exchange)
          .chain()
          .get('offer', '')
          .camelCase()
          .value()
          .toUpperCase()
        === _(`${infrastructure}`)
          .camelCase()
          .toUpperCase()
      );
    }

    isDedicated(exchange) {
      return this.isType(this.INFRASTRUCTURES.DEDICATED, exchange);
    }

    isDedicatedCluster(exchange) {
      return this.isType(this.INFRASTRUCTURES.DEDICATED_CLUSTER, exchange);
    }

    isHosted(exchange) {
      return this.isType(this.INFRASTRUCTURES.HOSTED, exchange);
    }

    isProvider(exchange) {
      return this.isType(this.INFRASTRUCTURES.PROVIDER, exchange);
    }
  },
);
