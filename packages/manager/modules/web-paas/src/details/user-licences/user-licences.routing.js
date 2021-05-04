export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.user-licences', {
    url: '/user-licences',
    views: {
      projectView: 'webPaasDetailsUserLicences',
    },
    resolve: {
      webPaasUserLicencesTrackingPrefix: () =>
        'web-paas::project-user-licenses::',
      goToInviteUser: /* @ngInject */ (
        $state,
        atInternet,
        webPaasUserLicencesTrackingPrefix,
      ) => () => {
        atInternet.trackClick({
          name: `${webPaasUserLicencesTrackingPrefix}invite-user`,
          type: 'action',
        });
        return $state.go('web-paas.dashboard.user-licences.invite-user');
      },
      goToDeleteUser: /* @ngInject */ (
        $state,
        atInternet,
        webPaasUserLicencesTrackingPrefix,
      ) => (customer) => {
        atInternet.trackClick({
          name: `${webPaasUserLicencesTrackingPrefix}user-table-options::delete-user`,
          type: 'action',
        });
        return $state.go('web-paas.dashboard.user-licences.delete-user', {
          customer,
        });
      },
      goToAddAddon: /* @ngInject */ (
        $state,
        projectId,
        atInternet,
        webPaasUserLicencesTrackingPrefix,
      ) => (addonType) => {
        atInternet.trackClick({
          name: `${webPaasUserLicencesTrackingPrefix}add-user-license`,
          type: 'action',
        });
        return $state.go('web-paas.dashboard.user-licences.add-addon', {
          projectId,
          addonType,
        });
      },
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
    atInternet: {
      rename: 'web::web-paas-platform-sh::project-user-licenses',
    },
  });
};
