import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export default class ExchangeServiceInfrastructure {
  /* @ngInject */
  constructor(wucExchange, exchangeVersion) {
    this.wucExchange = wucExchange;
    this.exchangeVersion = exchangeVersion;

    this.INFRASTRUCTURES = {
      HOSTED: 'Hosted',
      PROVIDER: 'Provider',
      DEDICATED: 'Dedicated',
      DEDICATED_CLUSTER: 'DedicatedCluster',
    };
  }

  isType(infrastructure, exchange = this.wucExchange.getValue()) {
    if (isEmpty(`${infrastructure}`)) {
      throw new Error("Can't work with empty input");
    }

    return (
      camelCase(get(exchange, 'offer', '')).toUpperCase() ===
      camelCase(`${infrastructure}`).toUpperCase()
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
}
