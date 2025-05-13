import { Exchange as ExchangeModel } from '@ovh-ux/manager-exchange';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.exchange', {
    url: '/exchange?organization&exchangeName',
    component: 'exchangeAccountRenew',
    resolve: {
      getAccounts: /* @ngInject */ (wucExchange, exchange) => (
        pageSize,
        offset,
        criteria,
      ) =>
        wucExchange.getAccountsForExchange(
          exchange,
          pageSize,
          offset,
          criteria,
        ),
      goBack: /* @ngInject */ (goToAutorenew) => (message, type) =>
        goToAutorenew(message, type),
      exchange: /* @ngInject */ (wucExchange, exchangeName, organization) =>
        wucExchange
          .getExchangeDetails(organization, exchangeName)
          .then((exchange) => new ExchangeModel(exchange)),
      exchangeName: /* @ngInject */ ($transition$) =>
        $transition$.params().exchangeName,
      organization: /* @ngInject */ ($transition$) =>
        $transition$.params().organization,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_exchange'),
      updateRenew: /* @ngInject */ (wucExchange, exchange) => (accounts) =>
        wucExchange.updateRenew(
          exchange.organization,
          exchange.domain,
          accounts,
        ),
    },
  });
};
