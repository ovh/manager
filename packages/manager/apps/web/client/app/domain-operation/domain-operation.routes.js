import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.domain.operation', {
    url: '/operation',
    component: 'domainOperation',
    resolve: {
      domainOperationLink: /* @ngInject */ ($state) =>
        $state.href('app.domain.operation.domain'),
      dnsOperationLink: /* @ngInject */ ($state) =>
        $state.href('app.domain.operation.dns'),
      getTabItemUrl: /* @ngInject */ ($state) => (tabItemName) =>
        $state.href(`app.domain.operation.${tabItemName}`),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
    },
    redirectTo: 'app.domain.operation.domain',
  });

  $stateProvider.state('app.domain.operation.domain', {
    url: `/domain?${ListLayoutHelper.urlQueryParams}`,
    component: 'operationTable',
    translations: { value: ['.'], format: 'json' },
    params: {
      ...ListLayoutHelper.stateParams,
    },
    resolve: {
      ...ListLayoutHelper.stateResolves,
      type: () => 'domain',
      apiPath: () => '/me/task/domain',
      dataModel: () => 'domain.Task',
      defaultFilterColumn: () => 'domain',
      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,
      hideBreadcrumb: () => true,
      operationActionEnum: /* @ngInject */ (schema) =>
        schema.models['domain.OperationActionEnum'].enum,
      operationStatusEnum: /* @ngInject */ (schema) =>
        schema.models['domain.OperationStatusEnum'].enum,
      operationFunctionEnum: /* @ngInject */ (schema) =>
        schema.models['domain.OperationFunctionEnum'].enum,
    },
  });

  $stateProvider.state('app.domain.operation.dns', {
    url: `/dns?${ListLayoutHelper.urlQueryParams}`,
    views: {
      '': {
        component: 'operationTable',
      },
    },
    params: {
      ...ListLayoutHelper.stateParams,
    },
    resolve: {
      ...ListLayoutHelper.stateResolves,
      type: () => 'dns',
      apiPath: () => '/me/task/dns',
      dataModel: () => 'me.dns.Task',
      defaultFilterColumn: () => 'domain',
      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,
      hideBreadcrumb: () => true,
      operationActionEnum: /* @ngInject */ (schema) =>
        schema.models['domain.OperationActionEnum'].enum,
      operationStatusEnum: /* @ngInject */ (schema) =>
        schema.models['domain.OperationStatusEnum'].enum,
      operationFunctionEnum: /* @ngInject */ (schema) =>
        schema.models['domain.OperationFunctionEnum'].enum,
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
    /* @ngInject */ ($state) => {
      $state.go('app.domain.operation');
    },
  );
};
