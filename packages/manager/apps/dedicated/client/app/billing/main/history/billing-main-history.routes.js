import controller from './billing-main-history.controller';
import template from './billing-main-history.html';

angular.module('Billing').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main.history', {
    url: '/history?filters',
    params: {
      filters: {
        value: '[]',
        squash: true,
      },
    },
    template,
    controller,
    controllerAs: '$ctrl',
    translations: {
      value: ['../history', './postalMailOptions'],
      format: 'json',
    },
    resolve: {
      filters: /* @ngInject */ ($transition$) => $transition$.params().filters,
      onListParamsChange: /* @ngInject */ ($state) => (params) =>
        $state.go('app.account.billing.main.history', params),
    },
  });
});
