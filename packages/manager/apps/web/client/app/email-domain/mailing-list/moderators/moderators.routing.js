import template from './email-domain-mailing-list-moderators-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.mailing-list.dashboard.moderators', {
    url: '/moderators',
    template,
    controller: 'MailingListsModeratorsCtrl',
    controllerAs: 'ctrlModerators',
    params: {
      mailingList: {},
    },
    resolve: {
      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
    },
  });
};
