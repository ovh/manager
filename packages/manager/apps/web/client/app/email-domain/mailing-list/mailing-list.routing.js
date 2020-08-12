import template from './email-domain-mailing-list-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.mailing-list', {
    url: '/mailing-list',
    template,
    controller: 'MailingListsTabModulesCtrl',
    controllerAs: 'ctrlMailingLists',
    resolve: {
      goToMailingList: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('app.email.domain.mailing-list', $transition$.params()),
      goToModerators: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('app.email.domain.mailing-list.moderators', {
          ...$transition$.params(),
          mailingList,
        }),
      goToSubscribers: /* @ngInject */ ($state, $transition$) => (
        mailingList,
      ) =>
        $state.go('app.email.domain.mailing-list.subscribers', {
          ...$transition$.params(),
          mailingList,
        }),
    },
  });
};
