import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import {
  DOMAIN_PREFIX_LISTING_MANAGE_DOMAINS,
  DOMAIN_PREFIX_PAGE_BUTTON_GO_TO_ORDER,
} from '../domains/domains.constant';

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
          resources.data.length === 0 &&
          (!transition.params().filter ||
            !JSON.parse(transition.params().filter).length)
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
      domainRenewalModeEnum: /* @ngInject */ (schema) =>
        schema.models['domain.RenewalStateEnum'].enum,
      domainNsTypeEnum: /* @ngInject */ (schema) =>
        schema.models['domain.nameServer.NameServerTypeEnum'].enum,
      dataModel: () => 'domain.DomainServiceWithIAM',
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
        RedirectionService,
      ) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('domains_order'),
          value: $translate.instant('domains_order'),
          onClick: () => {
            atInternet.trackClick({
              name: `${DOMAIN_PREFIX_PAGE_BUTTON_GO_TO_ORDER}`,
              type: 'action',
            });
            const url = `${RedirectionService.getURL('order')}webcloud`;
            $window.open(url, '_blank');
          },
        },
      }),
      goToRestoreRenew: /* @ngInject */ ($state) => (domains) =>
        $state.go('app.domain.index.restore-renew', { domains }),
      hideBreadcrumb: () => true,
    },
    atInternet: {
      rename: DOMAIN_PREFIX_LISTING_MANAGE_DOMAINS,
    },
  });
};
