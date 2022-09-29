import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getCdnOrderUrl } from './cdn.order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/cdn/dedicated',
      dataModel: () => 'cdnanycast.Anycast',
      defaultFilterColumn: () => 'service',
      header: /* @ngInject */ ($translate) => $translate.instant('cdn_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        service: productId,
      }) =>
        $state.href('app.networks.cdn.dedicated', {
          productId,
        }),
      topbarOptions: /* @ngInject */ ($translate, $window, coreConfig) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('cdn_order'),
          value: $translate.instant('cdn_order'),
          onClick: () => {
            $window.open(
              getCdnOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0
            ? { state: 'app.networks.cdn.onboarding' }
            : false,
        ),
  });
};
