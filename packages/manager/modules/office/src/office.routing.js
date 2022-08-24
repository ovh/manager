import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getOfficeOrderUrl } from './office.order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? { state: 'office.onboarding' } : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/license/office',
      dataModel: () => 'license.office.OfficeTenant',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('office_title'),
      customizableColumns: () => true,
      topbarOptions: /* @ngInject */ ($translate, $window, coreConfig) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('office_order'),
          value: $translate.instant('office_order'),
          onClick: () => {
            $window.open(
              getOfficeOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('office.product', {
          serviceName,
        }),
    },
  });
};
