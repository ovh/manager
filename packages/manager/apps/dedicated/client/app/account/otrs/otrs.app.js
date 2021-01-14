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
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('otrs_title'),
          },
        });
        $stateProvider.state('app.account.otrs-ticket-us', {
          url: '/support',
          templateUrl: 'account/otrs/otrs.html',
          controller: 'otrsCtrl',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('otrs_title'),
          },
        });
      } else {
        $stateProvider.state('app.account.otrs-ticket', {
          url: '/ticket',
          redirectTo: 'support',
        });
      }

      if (region === 'US') {
        $stateProvider.state('app.account.otrs-ticket.otrs-ticket-details', {
          url: '/:ticketId',
          templateUrl: 'account/otrs/detail/otrs-detail.html',
          controller: 'otrsDetailCtrl',
          resolve: {
            ticketId: /* @ngInject */ ($transition$) =>
              $transition$.params().ticketId,
            breadcrumb: /* @ngInject */ (ticketId) => ticketId,
          },
        });
        $stateProvider.state(
          'app.account.otrs-ticket-us.otrs-ticket-details-support',
          {
            url: '/tickets/:ticketId',
            templateUrl: 'account/otrs/detail/otrs-detail.html',
            controller: 'otrsDetailCtrl',
            resolve: {
              ticketId: /* @ngInject */ ($transition$) =>
                $transition$.params().ticketId,
              breadcrumb: /* @ngInject */ (ticketId) => ticketId,
            },
          },
        );
      } else {
        $stateProvider.state('app.account.otrs-ticket.otrs-ticket-details', {
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
  ])
  .run(/* @ngTranslationsInject:json ./translations */);
