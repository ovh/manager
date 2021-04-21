export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.user-licences', {
    url: '/user-licences',
    views: {
      projectView: 'webPaasDetailsUserLicences',
    },
    resolve: {
      goToInviteUser: /* @ngInject */ ($state) => () =>
        $state.go('web-paas.dashboard.user-licences.invite-user'),
      goToDeleteUser: /* @ngInject */ ($state) => (customer) =>
        $state.go('web-paas.dashboard.user-licences.delete-user', {
          customer,
        }),
      goToAddAddon: /* @ngInject */ ($state, projectId) => (addonType) =>
        $state.go('web-paas.dashboard.user-licences.add-addon', {
          projectId,
          addonType,
        }),
      goToUserLicences: /* @ngInject */ ($state, Alerter, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'web-paas.dashboard.user-licences',
          { projectId },
          {
            reload,
          },
        );
        if (message) {
          promise.then(() => {
            Alerter[type](message, 'web_paas_licences_alert');
          });
        }
        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_manage_users'),
    },
  });
};
