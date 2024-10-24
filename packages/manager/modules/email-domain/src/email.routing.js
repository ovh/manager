import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('noFiltersEmail')
        .then((noFiltersEmail) =>
          noFiltersEmail.data.length === 0
            ? { state: 'app.email.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      noFiltersEmail: /* @ngInject */ ($http) => $http.get('/email/domain'),
      apiPath: () => '/email/domain',
      dataModel: () => 'email.domain.DomainService',
      defaultFilterColumn: () => 'domain',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('emails_domain_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ domain: productId }) =>
        $state.href('app.email.domain', {
          productId,
        }),
      hideBreadcrumb: () => true,
      topbarOptions: /* @ngInject */ ($translate, $state, atInternet) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('emails_domain_order'),
          value: $translate.instant('emails_domain_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'web::email::index::order',
              type: 'action',
            });
            $state.go('app.mx-plan');
          },
        },
      }),
    },
  });

  $stateProvider.state('app.email-delegate.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      schema: /* @ngInject */ ($http) =>
        $http.get('/email/domain.json').then(({ data }) => data),
      apiPath: () => '/email/domain/delegatedAccount',
      dataModel: () => 'email.domain.AccountDelegated',
      staticResources: () => true,
      resources: /* @ngInject */ ($http, apiPath) =>
        $http
          .get(apiPath)
          .then(({ data }) => data.map((domain) => ({ domain }))),
      loadResource: /* @ngInject */ ($http, apiPath) => ({ domain }) =>
        $http.get(`${apiPath}/${domain}`).then(({ data }) => data),
      defaultFilterColumn: () => 'domain',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('emails_domain_delegate_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ domain: productId }) =>
        $state.href('app.email-delegate.dashboard', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
