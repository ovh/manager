import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sharepoint.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((instances) =>
          instances.length === 0 ? { state: 'sharepoint.onboarding' } : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/msServices',
      dataModel: () => 'msServices.SharepointServiceInfo',
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/sharepoints', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      staticResources: () => true,
      defaultFilterColumn: () => 'domain',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('sharepoint_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        domain: productId,
        organization: exchangeId,
      }) =>
        $state.href('sharepoint.product', {
          exchangeId,
          productId,
        }),
      topbarOptions: /* @ngInject */ ($translate, $state) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('sharepoint_order'),
          value: $translate.instant('sharepoint_order'),
          onClick: () => {
            $state.go('sharepoint.order');
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
