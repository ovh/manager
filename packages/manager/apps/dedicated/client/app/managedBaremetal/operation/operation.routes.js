export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.operation', {
    url: '/operation',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccOperation',
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('hasVCDMigration')
        .then((hasVCDMigration) =>
          hasVCDMigration
            ? 'app.managedBaremetal.details.dashboard-light'
            : false,
        );
    },
    resolve: {
      goToExecutionDateEdit: /* @ngInject */ ($state, productId) => (task) =>
        $state.go(
          'app.managedBaremetal.details.operation.execution-date-edit',
          {
            productId,
            operationToEdit: task,
          },
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('managed_baremetal_operation'),
    },
  });
};
