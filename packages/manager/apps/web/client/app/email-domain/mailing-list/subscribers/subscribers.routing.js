import template from './email-domain-mailing-list-subscribers-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.mailing-list.subscribers', {
    url: '/subscribers',
    template,
    controller: 'MailingListsSubscribersCtrl',
    controllerAs: 'ctrlSubscribers',
    params: {
      mailingList: {},
    },
    resolve: {
      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
    },
  });
};
