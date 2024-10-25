import controller from './user-contacts.controller';
import template from './user-contacts.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'account.contacts';

  $stateProvider.state(name, {
    url: '/contacts',
    template,
    controller,
    controllerAs: 'contactCtrl',
    redirectTo: 'account.contacts.services',
    translations: {
      format: 'json',
      value: ['../user'],
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_contacts'),
    },
  });
};
