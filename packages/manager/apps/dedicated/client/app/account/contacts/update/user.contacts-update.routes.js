import controller from './user-contacts-update.controller';
import template from './user-contacts-update.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.contact-update-domain', {
    url: '/contact/:currentDomain/:contactId?fields',
    template,
    controller,
    controllerAs: 'contactCtrl',
    translations: {
      format: 'json',
      value: ['../../user'],
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_contacts_update'),
    },
  });

  // TODO: Need refactoring this two steps ... Quickfix to manage legacy url correctly

  $stateProvider.state('app.account.contact-update', {
    url: '/contact/:contactId/?fields',
    template,
    controller,
    controllerAs: 'contactCtrl',
    translations: {
      format: 'json',
      value: ['../../user'],
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_contacts_update'),
    },
  });

  $stateProvider.state('app.account.contact-update2', {
    url: '/contact/:contactId?fields',
    template,
    controller,
    controllerAs: 'contactCtrl',
    translations: {
      format: 'json',
      value: ['../../user'],
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_contacts_update'),
    },
  });
};
