export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.analytics-data-platform.deploy.insufficient-quota', {
      url: '/insufficient-quota',
      views: {
        modal: {
          component: 'adpDeployInsufficientQuota',
        },
      },
      layout: 'modal',
      params: {
        publicCloudName: null,
        quotas: null,
      },
      resolve: {
        publicCloudName: $stateParams => $stateParams.publicCloudName,
        quotas: $stateParams => $stateParams.quotas,
        goBack: /* @ngInject */ goToDeploy => goToDeploy,
      },
    });
};
