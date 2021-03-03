angular.module('App').config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.domain.operation', {
    url: '/operation',
    templateUrl: 'domain-operation/domain-operation.html',
    controller: 'DomainOperationCtrl',
    controllerAs: 'ctrlOperations',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'domainsOperations';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      hideBreadcrumb: () => true,
    },
    translations: {
      value: ['../domain', '../domain-operation'],
      format: 'json',
    },
  });

  $stateProvider.state('app.domain.operation.progress', {
    url: '/progress/:operationId',
    templateUrl: 'domain-operation/progress/domain-operation-progress.html',
    controller: 'DomainOperationProgressCtrl',
    controllerAs: 'ctrlDomainOperationProgress',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'domainsOperations';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      hideBreadcrumb: () => true,
    },
    translations: {
      value: ['../domain', '../domain-operation'],
      format: 'json',
    },
  });

  $urlRouterProvider.when(
    /^\/configuration\/domains_operations/,
    /* @ngInject */ ($location) => {
      $location.url(
        $location
          .url()
          .replace('/configuration/domains_operations', '/domain/operation'),
      );
    },
  );
});
