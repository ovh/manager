import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import set from 'lodash/set';

export default class ExchangeOrderCtrl {
  /* @ngInject */
  constructor($scope, Exchange, OvhApiEmailExchange, User) {
    this.services = {
      $scope,
      Exchange,
      OvhApiEmailExchange,
      User,
    };

    this.loaders = {
      init: false,
    };

    User.getUrlOf('exchangeOrder').then((exchangeOrder) => {
      this.exchangeOrderUrl = exchangeOrder;
    });

    this.getExchanges();
  }

  getExchanges() {
    this.loaders.init = true;

    return this.services.Exchange.getAllExchangeServices()
      .then((exchanges) => {
        this.exchanges = map(exchanges, (exchange) => {
          set(exchange, 'domain', exchange.name);

          return exchange;
        });

        if (isEmpty(this.exchanges)) {
          this.alreadyHasAnExchange = false;
        } else {
          this.alreadyHasAnExchange = true;
          this.firstExchangeAccount = head(this.exchanges);
        }
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }

  getExchangeOrderUrl() {
    if (this.alreadyHasAnExchange && this.firstExchangeAccount != null) {
      return `#/configuration/${this.firstExchangeAccount.type.toLowerCase()}/${
        this.firstExchangeAccount.organization
      }/${this.firstExchangeAccount.name}?tab=ACCOUNT`;
    }
    return this.exchangeOrderUrl;
  }
}
