import { Exchange as ExchangeModel } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.exchange', {
    url: '/exchange?organization&exchangeName',
    component: 'exchangeAccountRenew',
    resolve: {
      getAccounts: /* @ngInject */ (exchangeBillingService, exchange) => (
        pageSize,
        offset,
        criteria,
      ) =>
        exchangeBillingService.getAccountsForExchange(
          exchange,
          pageSize,
          offset,
          criteria,
        ),
      exchange: /* @ngInject */ (
        exchangeBillingService,
        exchangeName,
        organization,
      ) =>
        exchangeBillingService
          .getExchangeDetails(organization, exchangeName)
          .then((exchange) => new ExchangeModel(exchange)),
      exchangeName: /* @ngInject */ ($transition$) =>
        $transition$.params().exchangeName,
      organization: /* @ngInject */ ($transition$) =>
        $transition$.params().organization,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_exchange'),
      updateRenew: /* @ngInject */ (exchangeBillingService, exchange) => (
        accounts,
      ) =>
        exchangeBillingService.updateRenew(
          exchange.organization,
          exchange.domain,
          accounts,
        ),
    },
  });
};
