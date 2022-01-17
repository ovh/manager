import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.terminate-all-dom', {
    url: '/delete-all-dom?serviceId&serviceType',
    views: {
      modal: {
        component: 'billingAutorenewTerminateAllDom',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      domains: /* @ngInject */ ($http, serviceId) =>
        $http.get(`/allDom/${serviceId}/domain`).then(({ data }) =>
          map(data, (domain) => {
            return {
              name: domain,
              selected: false,
            };
          }),
        ),
      breadcrumb: () => null,
    },
  });
};
