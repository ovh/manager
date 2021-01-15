import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
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
