angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.email', {
    abstract: true,
    template: '<div ui-view></div>',
  });

  $stateProvider.state('app.email.domain', {
    url: '/configuration/email-domain/:productId?tab',
    templateUrl: 'email-domain/email-domain.html',
    controller: 'EmailDomainCtrl',
    controllerAs: 'ctrlEmailDomain',
    reloadOnSearch: false,
    resolve: {
      currentSection: () => 'email_domain',
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'email_domain'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    redirectTo: (trans) => trans.injector().getAsync('WucEmails').then((WucEmails) => WucEmails.getDomain(trans.params().productId).then((data) => {
      if (data.migratedMXPlanServiceName) {
        return {
          state: 'app.email.mxplan',
          params: {
            productId: data.migratedMXPlanServiceName,
          },
        };
      }
      return null;
    })),
    translations: { value: ['../email', '../hosting', '../mailing-list'], format: 'json' },
  });

  $stateProvider.state('app.email.delegate', {
    url: '/configuration/email-delegate/:productId?tab',
    templateUrl: 'email-domain/delegate/email-domain-delegate.html',
    controller: 'EmailDelegateCtrl',
    controllerAs: 'ctrlEmailDelegate',
    reloadOnSearch: false,
    resolve: {
      currentSection: () => 'email_delegate',
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'email_delegate'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: { value: ['../email'], format: 'json' },
  });

  $stateProvider.state('app.mx-plan', {
    url: '/configuration/mx_plan?domain',
    templateUrl: 'email-domain/order/email-domain-order.html',
    controller: 'MXPlanOrderCtrl',
    controllerAs: 'ctrlMXPlanOrder',
    params: {
      domain: null,
    },
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'mxPlan'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: { value: ['../mx-plan'], format: 'json' },
  });
});
