export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.security', {
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

        return goBackToState(
          'app.dedicatedCloud.details.security',
          message,
          type,
        );
      },
      addKms: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.security.kms-add'),
      addSecurity: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.security.add'),
      deleteKms: /* @ngInject */ ($state) => (kmsToDelete) =>
        $state.go('app.dedicatedCloud.details.security.kms-delete', {
          kmsToDelete,
        }),
      deleteSecurity: /* @ngInject */ ($state) => (
        selectedPolicies,
        policies,
      ) =>
        $state.go('app.dedicatedCloud.details.security.delete', {
          policies,
          selectedPolicies,
        }),
      editKms: /* @ngInject */ ($state) => (kmsToEdit) =>
        $state.go('app.dedicatedCloud.details.security.kms-edit', {
          kmsToEdit,
        }),
      securityLogout: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.security.logout'),
      updateMaxSimultaneousConnection: /* @ngInject */ ($state) => (
        userLimitConcurrentSession,
      ) =>
        $state.go(
          'app.dedicatedCloud.details.security.simultaneous-connection-update',
          {
            userLimitConcurrentSession,
          },
        ),
      updateSecurity: /* @ngInject */ ($state) => (policy) =>
        $state.go('app.dedicatedCloud.details.security.update', {
          policy,
        }),
      updateSessionTimeout: /* @ngInject */ ($state) => (userSessionTimeout) =>
        $state.go(
          'app.dedicatedCloud.details.security.session-timeout-update',
          {
            userSessionTimeout,
          },
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_security'),
    },
  });
};
