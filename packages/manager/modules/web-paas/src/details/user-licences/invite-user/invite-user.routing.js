export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.user-licences.invite-user', {
    url: '/invite-user',
    views: {
      modal: {
        component: 'webPaasDetailsUserLicencesInviteUser',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToUserLicences) => goToUserLicences,
      breadcrumb: () => null,
    },
  });
};
