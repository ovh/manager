import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('freefaxes', {
    url: '/freefax',
    abstract: true,
  });

  $stateProvider.state('freefaxes.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'ovhManagerFreefaxes',
    params: ListLayoutHelper.stateParams,
    resolve: {
      apiPath: () => '/freefax',
      ...ListLayoutHelper.stateResolves,
      getFreefaxLink: /* @ngInject */ ($state) => (fax) =>
        $state.href('freefaxes.freefax', { serviceName: fax.number }),
      viewFreefax: /* @ngInject */ ($state) => (fax) =>
        $state.go('freefaxes.freefax', { serviceName: fax.number }),
    },
  });
};
