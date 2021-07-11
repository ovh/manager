import template from './external-contact.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.external-contact', {
    url: '/external-contact',
    controller: 'ExchangeTabExternalContactsCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_external_contact'),
    },
    onEnter: /* @ngInject */ (trackTab) => trackTab('external-contact'),
    atInternet: {
      ignore: true,
    },
  });
};
