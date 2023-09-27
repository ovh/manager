import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import set from 'lodash/set';

export default class ExchangeOrderCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreURLBuilder,
    wucExchange,
    OvhApiEmailExchange,
    WucUser,
  ) {
    this.coreURLBuilder = coreURLBuilder;
    this.services = {
      $scope,
      wucExchange,
      OvhApiEmailExchange,
      WucUser,
    };

    this.loaders = {
      init: false,
    };

    WucUser.getUrlOf('exchangeOrder').then((exchangeOrder) => {
      this.exchangeOrderUrl = exchangeOrder;
    });

    this.getExchanges();
  }

  getExchanges() {
    this.loaders.init = true;

    return this.services.wucExchange
      .getAllExchangeServices()
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
      return this.coreURLBuilder.buildURL(
        'web',
        '#/configuration/:type/:organization/:productId',
        {
          type: this.firstExchangeAccount.type.toLowerCase(),
          organization: this.firstExchangeAccount.organization,
          productId: this.firstExchangeAccount.name,
          tab: 'ACCOUNT',
        },
      );
    }
    return this.exchangeOrderUrl;
  }
}
