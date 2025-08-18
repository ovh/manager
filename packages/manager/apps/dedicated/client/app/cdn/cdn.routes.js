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
      changelog: () => 'cdn',
      customizableColumns: () => true,
      columnConfig: /* @ngInject */ ($translate) => ({
        data: [
          {
            label: $translate.instant(`cdn_columns_header_service`),
            hidden: false,
            property: 'service',
            serviceLink: true,
          },
          {
            label: $translate.instant(`cdn_columns_header_backendLimit`),
            hidden: false,
            property: 'backendLimit',
          },
          {
            label: $translate.instant(`cdn_columns_header_backendUse`),
            hidden: false,
            property: 'backendUse',
          },
          {
            label: $translate.instant(
              `cdn_columns_header_cacheRuleLimitPerDomain`,
            ),
            hidden: false,
            property: 'cacheRuleLimitPerDomain',
          },
          {
            label: $translate.instant(`cdn_columns_header_logUrl`),
            hidden: false,
            property: 'logUrl',
          },
          {
            label: $translate.instant(`cdn_columns_header_offer`),
            hidden: true,
            property: 'offer',
          },
          {
            label: $translate.instant(`cdn_columns_header_quota`),
            hidden: true,
            property: 'quota',
          },
        ],
      }),
      getServiceNameLink: /* @ngInject */ ($state) => ({
        service: productId,
      }) =>
        $state.href('app.networks.cdn.dedicated', {
          productId,
        }),
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
          label: $translate.instant('cdn_order'),
          value: $translate.instant('cdn_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'dedicated::networks::cdn::index::order',
              type: 'action',
            });
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
