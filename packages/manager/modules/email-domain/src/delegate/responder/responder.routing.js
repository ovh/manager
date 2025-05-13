import controller from './email-domain-delegate-responder.controller';
import template from './email-domain-delegate-responder.html';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('app.email-delegate.dashboard.responder', {
    url: '/responder',
    template,
    controller,
    controllerAs: 'ctrlEmailDelegateResponder',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_delegate_responder'),
    },
  });
