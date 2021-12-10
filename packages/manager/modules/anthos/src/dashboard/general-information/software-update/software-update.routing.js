export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.general-information.software-update', {
    url: '/software-update',
    views: {
      'anthosTenantView@anthos.dashboard': 'anthosDashboardSoftwareUpdate',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
