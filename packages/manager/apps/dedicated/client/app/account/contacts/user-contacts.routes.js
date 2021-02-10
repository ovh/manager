import controller from './user-contacts.controller';
import template from './user-contacts.html';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.contacts';

  $stateProvider.state(name, {
    url: '/contacts',
    template,
    controller,
    controllerAs: 'contactCtrl',
    redirectTo: 'app.account.contacts.services',
    translations: {
      format: 'json',
      value: ['../user'],
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_contacts'),
    },
  });

  $urlRouterProvider.when(/^\/useraccount\/contacts/, ($location, $state) =>
    $state.go(`${name}.services`, $location.search()),
  );
};
