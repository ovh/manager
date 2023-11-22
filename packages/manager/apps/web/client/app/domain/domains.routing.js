import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getDomainOrderUrl } from './domains.order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      '': {
        component: 'managerListDomainLayout',
      },
    },
    translations: { value: ['.'], format: 'json' },
    params: ListLayoutHelper.stateParams,

    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 && !transition.params().filter
            ? { state: 'app.domain.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/domain',
      schema: /* @ngInject */ ($http) =>
        $http.get('/domain.json').then(({ data: schema }) => schema),
      domainStateEnum: /* @ngInject */ (schema) =>
        schema.models['domain.DomainStateEnum'].enum,
      domainRenewalModeEnum: () =>
        // @TODO get enum from schema.models when API is available
        [
          'automatic_renew',
          'manual_renew',
          'cancellation_requested',
          'cancellation_complete',
          'unpaid',
          'expired',
        ],
      domainDnssecStateEnum: () =>
        // @TODO get enum from schema.models when API is available
        ['enabled', 'disabled', 'not_supported'],
      domainSuspensionStateEnum: /* @ngInject */ (schema) =>
        schema.models['domain.DomainSuspensionStateEnum'].enum,
      domainLockStatusEnum: /* @ngInject */ (schema) =>
        schema.models['domain.DomainLockStatusEnum'].enum,
      domainNsTypeEnum: /* @ngInject */ (schema) =>
        schema.models['domain.DomainNsTypeEnum'].enum,
      dataModel: () => 'domain.Domain',
      defaultFilterColumn: () => 'domain',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('domains_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        domain,
        parentService,
      }) =>
        parentService
          ? $state.href('app.alldom.domain', {
              allDom: parentService.name,
              productId: domain,
            })
          : $state.href('app.domain.product', {
              productId: domain,
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
          label: $translate.instant('domains_order'),
          value: $translate.instant('domains_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'web::domain::index::order',
              type: 'action',
            });
            $window.open(
              getDomainOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      goToRestoreRenew: /* @ngInject */ ($state) => (domains) =>
        $state.go('app.domain.index.restore-renew', { domains }),
      hideBreadcrumb: () => true,
    },
  });
};
