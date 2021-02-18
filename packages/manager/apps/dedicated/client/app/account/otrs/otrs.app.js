import ovhManagerCore from '@ovh-ux/manager-core';

angular
  .module('Module.otrs', [
    'Module.otrs.controllers',
    'Module.otrs.directives',
    'Module.otrs.services',
    'Module.otrs.filters',
    'ngOvhUtils',
    'ngRoute',
    ovhManagerCore,
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(
    /* @ngInject */ ($stateProvider, coreConfigProvider) => {
      const region = coreConfigProvider.getRegion();

      if (region === 'US') {
        $stateProvider.state('app.account.otrs-ticket', {
          url: '/ticket',
          templateUrl: 'account/otrs/otrs.html',
          controller: 'otrsCtrl',
          translations: { value: ['../otrs'], format: 'json' },
        });
        $stateProvider.state('app.account.otrs-ticket-us', {
          url: '/support',
          templateUrl: 'account/otrs/otrs.html',
          controller: 'otrsCtrl',
          translations: { value: ['../otrs'], format: 'json' },
        });
      } else {
        $stateProvider.state('app.account.otrs-ticket', {
          url: '/ticket',
          redirectTo: 'support',
        });
      }

      if (region === 'US') {
        $stateProvider.state('app.account.otrs-ticket-details', {
          url: '/ticket/:ticketId',
          templateUrl: 'account/otrs/detail/otrs-detail.html',
          controller: 'otrsDetailCtrl',
          translations: { value: ['../otrs'], format: 'json' },
        });
        $stateProvider.state('app.account.otrs-ticket-details-support', {
          url: '/support/tickets/:ticketId',
          templateUrl: 'account/otrs/detail/otrs-detail.html',
          controller: 'otrsDetailCtrl',
          translations: { value: ['../otrs'], format: 'json' },
        });
      } else {
        $stateProvider.state('app.account.otrs-ticket-details', {
          url: '/ticket/:ticketId',
          redirectTo: 'support.tickets.ticket',
        });
      }
    },
  )
  .run([
    'Module.otrs.services.otrs',
    (Otrs) => {
      Otrs.init();
    },
  ]);
