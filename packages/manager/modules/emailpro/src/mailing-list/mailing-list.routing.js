import template from './emailpro-mailing-list-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('mxplan.dashboard.mailing-list', {
    url: '/mailing-list',
    template,
    controller: 'EmailProMXPlanMailingListsTabModulesCtrl',
    controllerAs: 'ctrlEmailProMXPlanMailingLists',
    resolve: {
      goToMailingList: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('mxplan.dashboard.mailing-list', $transition$.params()),
      goToModerators: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('mxplan.dashboard.mailing-list.moderators', {
          ...$transition$.params(),
          mailingList,
        }),
      goToSubscribers: /* @ngInject */ ($state, $transition$) => (
        mailingList,
      ) =>
        $state.go('mxplan.dashboard.mailing-list.subscribers', {
          ...$transition$.params(),
          mailingList,
        }),
    },
  });
};
