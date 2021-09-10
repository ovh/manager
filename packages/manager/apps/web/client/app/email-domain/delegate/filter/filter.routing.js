import controller from './email-domain-delegate-filter.controller';
import template from './email-domain-delegate-filter.html';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('app.email-delegate.dashboard.account.filter', {
    url: '/filter',
    template,
    controller,
    controllerAs: 'ctrlEmailDelegateFilter',
    params: {
      email: {},
      emails: [],
    },
    resolve: {
      email: /* @ngInject */ ($transition$) => $transition$.params().email,
      emails: /* @ngInject */ ($transition$) => $transition$.params().emails,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('emails_domain_delegate_filter'),
    },
  });
