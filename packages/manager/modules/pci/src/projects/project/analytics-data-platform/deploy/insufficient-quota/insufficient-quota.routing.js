export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.analytics-data-platform.deploy.insufficient-quota',
    {
      url: '/insufficient-quota',
      views: {
        modal: {
          component: 'analyticsDataPlatformDeployInsufficientQuota',
        },
      },
      layout: 'modal',
      params: {
        publicCloudName: null,
        quotas: null,
      },
      resolve: {
        publicCloudName: ($transition$) =>
          $transition$.params().publicCloudName,
        quotas: ($transition$) => $transition$.params().quotas,
        goBack: /* @ngInject */ (goToDeploy) => goToDeploy,
      },
    },
  );
};
