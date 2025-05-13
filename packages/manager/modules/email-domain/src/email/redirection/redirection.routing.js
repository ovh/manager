import controller from './email-domain-email-redirection.controller';
import template from './email-domain-email-redirection.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.redirection', {
    url: '/redirection',
    template,
    controller,
    controllerAs: 'ctrlEmailDomainEmailRedirection',
    params: {
      quotas: {},
    },
    resolve: {
      quotas: /* @ngInject */ ($transition$) => $transition$.params().quotas,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_email_redirection'),
    },
  });
};
