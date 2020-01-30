angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.domain.operation', {
    url: '/configuration/domains_operations',
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
    },
    translations: {
      value: ['../domain', '../domain-operation'],
      format: 'json',
    },
  });

  $stateProvider.state('app.domain.operation-progress', {
    url: '/configuration/domain_operation/progress/:operationId',
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
    },
    translations: {
      value: ['../domain', '../domain-operation'],
      format: 'json',
    },
  });
});
