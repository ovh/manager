import controller from './email-domain-mailing-list-subscribers.controller';
import template from './email-domain-mailing-list-subscribers-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.mailing-list.dashboard.subscribers', {
    url: '/subscribers',
    template,
    controller,
    controllerAs: 'ctrlSubscribers',
    params: {
      mailingList: null,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('mailingList')
        .then((mailingList) => {
          return !mailingList
            ? { state: 'app.email.domain.mailing-list.dashboard' }
            : false;
        }),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_mailing_list_moderators'),

      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
    },
  });
};
