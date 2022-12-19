import template from './emailpro-mailing-list-subscribers-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('mxplan.dashboard.mailing-list.dashboard.subscribers', {
    url: '/subscribers',
    template,
    controller: 'EmailProMXPlanMailingListsSubscribersCtrl',
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
            ? { state: 'mxplan.dashboard.mailing-list.dashboard' }
            : false;
        }),
    resolve: {
      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
    },
  });
};
