import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('freefaxes.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'ovhManagerFreefax',
    params: ListLayoutHelper.stateParams,
    resolve: {
      apiPath: () => '/freefax',
      ...ListLayoutHelper.stateResolves,
      defaultFilterColumn: () => 'number',
      dataModel: () => 'freefax.FreefaxProperties',
      getFreefaxLink: /* @ngInject */ ($state) => (fax) =>
        $state.href('freefaxes.freefax', { serviceName: fax.number }),
      viewFreefax: /* @ngInject */ ($state) => (fax) =>
        $state.go('freefaxes.freefax', { serviceName: fax.number }),
      hideBreadcrumb: () => true,
      gotoOrder: /* @ngInject */ ($window) => () => {
        $window.open('https://www.ovhtelecom.fr/fax/', '_blank');
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'freefaxes.onboarding' : false,
        ),
  });
};
