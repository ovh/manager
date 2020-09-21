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
        $state.go('mxplan.dashboard.mailing-list.dashboard.moderators', {
          ...$transition$.params(),
          mailingList,
          name: mailingList.name,
        }),
      goToSubscribers: /* @ngInject */ ($state, $transition$) => (
        mailingList,
      ) =>
        $state.go('mxplan.dashboard.mailing-list.dashboard.subscribers', {
          ...$transition$.params(),
          mailingList,
          name: mailingList.name,
        }),
    },
  });

  $stateProvider.state('mxplan.dashboard.mailing-list.dashboard', {
    url: '/:name',
    template: '<div ui-view></div>',
    redirectTo: 'mxplan.dashboard.mailing-list',
  });
};
