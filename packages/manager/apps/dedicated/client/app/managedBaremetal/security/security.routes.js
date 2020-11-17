export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security', {
    url: '/security',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccSecurity',
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

        return goBackToState('app.managedBaremetal.security', message, type);
      },
      addKms: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.security.kms-add'),
      addSecurity: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.security.add'),
      deleteKms: /* @ngInject */ ($state) => (kmsToDelete) =>
        $state.go('app.managedBaremetal.security.kms-delete', {
          kmsToDelete,
        }),
      deleteSecurity: /* @ngInject */ ($state) => (
        selectedPolicies,
        policies,
      ) =>
        $state.go('app.managedBaremetal.security.delete', {
          policies,
          selectedPolicies,
        }),
      editKms: /* @ngInject */ ($state) => (kmsToEdit) =>
        $state.go('app.managedBaremetal.security.kms-edit', {
          kmsToEdit,
        }),
      securityAccess: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.security.access'),
      securityLogout: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.security.logout'),
      updateMaxSimultaneousConnection: /* @ngInject */ ($state) => (
        userLimitConcurrentSession,
      ) =>
        $state.go(
          'app.managedBaremetal.security.simultaneous-connection-update',
          {
            userLimitConcurrentSession,
          },
        ),
      updateSecurity: /* @ngInject */ ($state) => (policy) =>
        $state.go('app.managedBaremetal.security.update', {
          policy,
        }),
      updateSessionTimeout: /* @ngInject */ ($state) => (userSessionTimeout) =>
        $state.go('app.managedBaremetal.security.session-timeout-update', {
          userSessionTimeout,
        }),
    },
  });
};
