import controller from './domain-operation.controller';
import template from './domain-operation.html';

angular.module('App').config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.domain.operation', {
    url: '/operation?tab',
    controller,
    template,
    controllerAs: '$ctrl',
    params: {
      tab: 'domain',
    },
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
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
      domainOperationLink: /* @ngInject */ ($state) =>
        $state.href('app.domain.operation', { tab: 'domain' }),
      dnsOperationLink: /* @ngInject */ ($state) =>
        $state.href('app.domain.operation', { tab: 'dns' }),
    },
    translations: { value: ['../domain', '.'], format: 'json' },
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
