export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.security', {
    url: '/security',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccSecurity',
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
      goBack: /* @ngInject */ (goBackToState, OvhApiDedicatedCloud) => (
        message = false,
        type = 'success',
      ) => {
        if (message && type === 'success') {
          OvhApiDedicatedCloud.VMEncryption()
            .kms()
            .v6()
            .resetCache();
          OvhApiDedicatedCloud.VMEncryption()
            .kms()
            .v6()
            .resetQueryCache();
        }

        return goBackToState(
          'app.managedBaremetal.details.security',
          message,
          type,
        );
      },
      addKms: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.security.kms-add'),
      addSecurity: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.security.add'),
      deleteKms: /* @ngInject */ ($state) => (kmsToDelete) =>
        $state.go('app.managedBaremetal.details.security.kms-delete', {
          kmsToDelete,
        }),
      deleteSecurity: /* @ngInject */ ($state) => (
        selectedPolicies,
        policies,
      ) =>
        $state.go('app.managedBaremetal.details.security.delete', {
          policies,
          selectedPolicies,
        }),
      editKms: /* @ngInject */ ($state) => (kmsToEdit) =>
        $state.go('app.managedBaremetal.details.security.kms-edit', {
          kmsToEdit,
        }),
      securityLogout: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.security.logout'),
      updateMaxSimultaneousConnection: /* @ngInject */ ($state) => (
        userLimitConcurrentSession,
      ) =>
        $state.go(
          'app.managedBaremetal.details.security.simultaneous-connection-update',
          {
            userLimitConcurrentSession,
          },
        ),
      updateSecurity: /* @ngInject */ ($state) => (policy) =>
        $state.go('app.managedBaremetal.details.security.update', {
          policy,
        }),
      updateSessionTimeout: /* @ngInject */ ($state) => (userSessionTimeout) =>
        $state.go(
          'app.managedBaremetal.details.security.session-timeout-update',
          {
            userSessionTimeout,
          },
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('managed_baremetal_security'),
    },
  });
};
