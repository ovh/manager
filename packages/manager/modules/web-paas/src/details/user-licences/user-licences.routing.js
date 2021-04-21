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
    },
  });
};
