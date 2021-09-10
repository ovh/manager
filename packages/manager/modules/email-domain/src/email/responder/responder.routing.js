import controller from './email-domain-email-responder.controller';
import template from './email-domain-email-responder.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.responder', {
    url: '/responder',
    template,
    controller,
    controllerAs: '$ctrl',
    params: {
      quotas: {},
      emails: [],
    },
    resolve: {
      emails: /* @ngInject */ ($transition$) => $transition$.params().emails,
      quotas: /* @ngInject */ ($transition$) => $transition$.params().quotas,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_email_responder'),
    },
  });
};
