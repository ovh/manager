import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((instances) =>
          instances.length === 0 ? { state: 'exchange.onboarding' } : false,
        ),

    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/email/exchange',
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/exchanges', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      dataModel: () => 'email.exchange.ExchangeService',
      staticResources: () => true,
      defaultFilterColumn: () => 'domain',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ domain }) =>
        $state.href('exchange.dashboard', {
          organization: domain,
          productId: domain,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
