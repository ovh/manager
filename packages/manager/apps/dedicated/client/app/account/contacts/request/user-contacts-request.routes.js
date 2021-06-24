import controller from './user-contacts-request.controller';
import template from './user-contacts-request.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.contacts.requests', {
    url: '/requests?taskId&token',
    template,
    controller,
    controllerAs: 'ctrlContactRequests',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_contacts_request'),
    },
  });
};
