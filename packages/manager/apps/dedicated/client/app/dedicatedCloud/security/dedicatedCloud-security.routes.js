export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.security', {
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

        return goBackToState('app.dedicatedClouds.security', message, type);
      },
      addKms: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.security.kms-add'),
      addSecurity: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.security.add'),
      deleteKms: /* @ngInject */ ($state) => (kmsToDelete) =>
        $state.go('app.dedicatedClouds.security.kms-delete', {
          kmsToDelete,
        }),
      deleteSecurity: /* @ngInject */ ($state) => (
        selectedPolicies,
        policies,
      ) =>
        $state.go('app.dedicatedClouds.security.delete', {
          policies,
          selectedPolicies,
        }),
      editKms: /* @ngInject */ ($state) => (kmsToEdit) =>
        $state.go('app.dedicatedClouds.security.kms-edit', {
          kmsToEdit,
        }),
      securityAccess: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.security.access'),
      securityLogout: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.security.logout'),
      updateMaxSimultaneousConnection: /* @ngInject */ ($state) => (
        userLimitConcurrentSession,
      ) =>
        $state.go(
          'app.dedicatedClouds.security.simultaneous-connection-update',
          {
            userLimitConcurrentSession,
          },
        ),
      updateSecurity: /* @ngInject */ ($state) => (policy) =>
        $state.go('app.dedicatedClouds.security.update', {
          policy,
        }),
      updateSessionTimeout: /* @ngInject */ ($state) => (userSessionTimeout) =>
        $state.go('app.dedicatedClouds.security.session-timeout-update', {
          userSessionTimeout,
        }),
    },
  });
};
