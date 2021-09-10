import controller from './email-domain-mailing-list-subscribers.controller';
import template from './email-domain-mailing-list-subscribers-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.mailing-list.dashboard.subscribers', {
    url: '/subscribers',
    template,
    controller,
    controllerAs: 'ctrlSubscribers',
    params: {
      mailingList: {},
    },
    resolve: {
      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_mailing_list_moderators'),
    },
  });
};
