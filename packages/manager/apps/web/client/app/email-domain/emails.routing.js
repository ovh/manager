import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.index', {
    url: `/configuration/email-domain?${ListLayoutHelper.urlQueryParams}`,
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
    },
  });
};
