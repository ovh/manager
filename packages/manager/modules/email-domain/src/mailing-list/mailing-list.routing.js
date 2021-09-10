import controller from './email-domain-mailing-list-tab-modules.controller';
import template from './email-domain-mailing-list-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.mailing-list', {
    url: '/mailing-list',
    template,
    controller,
    controllerAs: 'ctrlMailingLists',
    resolve: {
      goToMailingList: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('app.email.domain.mailing-list', $transition$.params()),
      goToModerators: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('app.email.domain.mailing-list.dashboard.moderators', {
          ...$transition$.params(),
          mailingList,
          name: mailingList.name,
        }),
      goToSubscribers: /* @ngInject */ ($state, $transition$) => (
        mailingList,
      ) =>
        $state.go('app.email.domain.mailing-list.dashboard.subscribers', {
          ...$transition$.params(),
          mailingList,
          name: mailingList.name,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_mailing_list'),
    },
  });

  $stateProvider.state('app.email.domain.mailing-list.dashboard', {
    url: '/:name',
    template: '<div ui-view></div>',
    redirectTo: 'app.email.domain.mailing-list',
    resolve: {
      name: /* @ngInject */ ($transition$) => $transition$.params().name,
      breadcrumb: /* @ngInject */ (name) => name,
    },
  });
};
