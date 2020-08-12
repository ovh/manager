import { Exchange as ExchangeModel } from '@ovh-ux/manager-exchange';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.exchange', {
    url: '/exchange?organization&exchangeName',
    component: 'exchangeAccountRenew',
    resolve: {
      getAccounts: /* @ngInject */ (Exchange, exchange) => (
        pageSize,
        offset,
        criteria,
      ) =>
        Exchange.getAccountsForExchange(exchange, pageSize, offset, criteria),
      goBack: /* @ngInject */ (goToAutorenew) => (message, type) =>
        goToAutorenew(message, type),
      exchange: /* @ngInject */ (Exchange, exchangeName, organization) =>
        Exchange.getExchangeDetails(organization, exchangeName).then(
          (exchange) => new ExchangeModel(exchange),
        ),
      exchangeName: /* @ngInject */ ($transition$) =>
        $transition$.params().exchangeName,
      organization: /* @ngInject */ ($transition$) =>
        $transition$.params().organization,
      updateRenew: /* @ngInject */ (Exchange, exchange) => (accounts) =>
        Exchange.updateRenew(exchange.organization, exchange.domain, accounts),
    },
  });
};
