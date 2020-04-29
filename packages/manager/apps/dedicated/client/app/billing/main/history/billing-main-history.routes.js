export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.main.history', {
    url: '/history?filters',
    params: {
      filters: {
        value: '[]',
        squash: true,
      },
    },
    component: 'billingHistory',
    translations: {
      value: ['./postalMailOptions'],
      format: 'json',
    },
    resolve: {
      filters: /* @ngInject */ ($transition$) => $transition$.params().filters,
      onListParamsChange: /* @ngInject */ ($state) => (params) =>
        $state.go('app.account.billing.main.history', params),
    },
  });
};
