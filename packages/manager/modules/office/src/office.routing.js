import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getOfficeOrderUrl } from './office.order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'microsoftOfficeLicense',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length === 0 ? { state: 'office.onboarding' } : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/license/office',
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/service', {
            params: {
              external: false,
              type: '/license/office',
            },
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      dataModel: () => 'license.office.OfficeTenant',
      defaultFilterColumn: () => 'serviceName',
      customizableColumns: () => true,
      topbarOptions: /* @ngInject */ (
        $translate,
        $window,
        coreConfig,
        atInternet,
      ) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('office_order'),
          value: $translate.instant('office_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'office::index::order',
              type: 'action',
            });
            $window.open(
              getOfficeOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      gotoOrder: /* @ngInject */ ($window, coreConfig) => () => {
        $window.open(
          getOfficeOrderUrl(coreConfig.getUser().ovhSubsidiary),
          '_blank',
        );
      },
      hideBreadcrumb: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('office.product', {
          serviceName,
        }),
    },
  });
};
