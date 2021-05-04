export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.user-licences', {
    url: '/user-licences',
    views: {
      projectView: 'webPaasDetailsUserLicences',
    },
    resolve: {
      breadcrumb: () => false,
      userList: /* @ngInject */ (WebPaas, projectId) =>
        WebPaas.getUsers(projectId),
      inviteUser: /* @ngInject */ ($state) => () =>
        $state.go('web-paas.dashboard.user-licences.invite-user'),
      deleteUser: /* @ngInject */ ($state) => (customer) =>
        $state.go('web-paas.dashboard.user-licences.delete-user', {
          customer,
        }),
      addUserLink: /* @ngInject */ ($state, projectId) =>
        $state.href('web-paas.dashboard.service.add-addon', {
          projectId,
          addonType: 'additional-user-license',
        }),
      goToUserLicences: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go('web-paas.dashboard.user-licences', {
          reload,
        });
        if (message) {
          promise.then(() => {
            Alerter.alertFromSWS(message, type, 'web_paas_licences_alert');
          });
        }
        return promise;
      },
    },
  });
};
