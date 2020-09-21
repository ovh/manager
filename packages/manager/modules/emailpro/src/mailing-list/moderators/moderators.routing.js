import template from './emailpro-mailing-list-moderators-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('mxplan.dashboard.mailing-list.dashboard.moderators', {
    url: '/moderators',
    template,
    controller: 'EmailProMXPlanMailingListsModeratorsCtrl',
    controllerAs: 'ctrlModerators',
    params: {
      mailingList: {},
    },
  });
};
